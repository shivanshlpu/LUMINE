const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Lane = require('./models/Lane');
const SensorHistory = require('./models/SensorHistory');
const Alert = require('./models/Alert');
require('dotenv').config();

// --- Configuration ---
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jaganbhakti900_db_user:shivansh900@shiva100.9apjqfr.mongodb.net/lumine?appName=shiva100';

// --- App Setup ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow any frontend to connect (for dev)
        methods: ["GET", "POST"]
    }
});

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Global Request Logger ---
app.use((req, res, next) => {
    console.log(`🔔 Incoming Request: ${req.method} ${req.url}`);
    next();
});

// --- Database Connection ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });

// --- Helper Functions ---
const calculateStatus = (temp, hum) => {
    // Somnath Baseline Temperature: ~28°C
    // Logic: Crowd increases temp from baseline.
    // > 30°C: Warning (Yellow)
    // > 35°C: Critical (Red)

    if (temp > 35) return 'RED';
    if (temp > 30) return 'YELLOW';
    return 'GREEN';
};

// --- Routes ---

// 1. Health Check
app.get('/', (req, res) => {
    res.send('Lumine Backend is Running');
});

// 2. Get All Lanes (General API)
app.get('/api/lanes', async (req, res) => {
    try {
        const lanes = await Lane.find().sort({ laneId: 1 });
        res.json(lanes);
    } catch (err) {
        console.error('Error fetching lanes:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 3. Get Lane Status (Specific for Dashboard)
app.get('/api/lane-status', async (req, res) => {
    try {
        const lanes = await Lane.find({}, { laneId: 1, status: 1, temperature: 1, humidity: 1, lastUpdated: 1 }).sort({ laneId: 1 });
        res.json(lanes);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4. Get Heatmap Data (Specific for Heatmap)
app.get('/api/heatmap-data', async (req, res) => {
    try {
        const lanes = await Lane.find().sort({ laneId: 1 });
        res.json(lanes);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 5. Update Sensor Data (Main Endpoint)
// Supports both /api/lanes/update-sensor (legacy) and /api/sensor-data (new)
const handleSensorUpdate = async (req, res) => {
    try {
        console.log('📥 Received Data:', JSON.stringify(req.body));

        let { laneId, temperature, humidity, heatIndex, status, count, cardId, sos, isSos, issos, receiver_coord, sender_id } = req.body;

        // Normalize SOS flag (Hardware sends 'issos', 'isSos', or 'sos')
        if (issos === true || isSos === true) sos = true;

        // Map sender_id to cardId if present (for consistency with new requirements)
        if (sender_id && !cardId) cardId = sender_id;

        // 1. Normalize Lane ID (Handle "LANE_01" -> 1)
        // If laneId is string like "LANE_01", extract number. If just "R2", keep as string if needed or map.
        let normalizedLaneId = laneId;
        if (typeof laneId === 'string') {
            const numMatch = laneId.match(/\d+/);
            if (numMatch) {
                normalizedLaneId = parseInt(numMatch[0], 10);
            }
        }

        // 2. Auto-Create Lane if not exists
        let laneDoc = await Lane.findOne({ laneId: String(normalizedLaneId) });
        if (!laneDoc) {
            console.log(`🆕 New Lane Detected: ${normalizedLaneId}`);

            // Define default locations for known lanes
            let defaultLocation = null;
            if (String(normalizedLaneId) === '2') {
                defaultLocation = { lat: 20.8880, lng: 70.4010 }; // Main Gate
            } else if (String(normalizedLaneId) === '1') {
                defaultLocation = { lat: 20.8882, lng: 70.4012 }; // Lane 1 Queue
            }

            laneDoc = new Lane({
                laneId: String(normalizedLaneId),
                status: 'unplaced',
                location: receiver_coord ? { lat: receiver_coord.x, lng: receiver_coord.y } : defaultLocation
            });
            await laneDoc.save();

            io.emit('receiver_added', {
                receiver_id: String(normalizedLaneId),
                label: `lane_${normalizedLaneId}`,
                x: laneDoc.location?.lat,
                y: laneDoc.location?.lng,
                receiver_id: String(normalizedLaneId),
                sender_id: cardId,
                ts: new Date()
            });
            console.log(`👀 Card Seen: ${cardId} at Lane ${normalizedLaneId}`);
        }

        // 3. SOS Handling
        if (sos === true || req.body.type === 'sos') {
            console.log(`🚨 SOS TRIGGERED! Raw Payload:`, JSON.stringify(req.body));

            // Check for existing active alert for this lane to prevent duplicates
            const existingAlert = await Alert.findOne({
                receiverId: String(normalizedLaneId),
                status: { $ne: 'resolved' }
            });

            if (existingAlert) {
                console.log(`⚠️ Alert already active for Lane ${normalizedLaneId}. Skipping creation.`);
            } else {
                const alertId = `A${Date.now()}`;

                const laneNum = parseInt(normalizedLaneId, 10);
                let alertLocation = null;

                // FORCE location for known lanes to ensure visual consistency with Heatmap
                if (laneNum === 1) {
                    alertLocation = { lat: 20.8882, lng: 70.4012 }; // Lane 1 (Red Dot)
                } else if (laneNum === 2) {
                    alertLocation = { lat: 20.8880, lng: 70.4010 }; // Lane 2 (Green Dot)
                } else {
                    // For other lanes, use payload or DB location
                    alertLocation = receiver_coord ? { lat: receiver_coord.x, lng: receiver_coord.y } : laneDoc.location;
                }

                console.log(`📍 SOS Location for Lane ${laneNum}:`, alertLocation);

                const newAlert = new Alert({
                    alertId,
                    type: 'sos',
                    senderId: cardId || 'Unknown',
                    receiverId: String(normalizedLaneId),
                    location: alertLocation,
                    reason: req.body.sos_reason || req.body.reason || 'Emergency',
                    payload: req.body
                });
                await newAlert.save();

                io.emit('alert', {
                    type: 'alert',
                    alert_id: alertId,
                    alert_type: 'sos',
                    x: newAlert.location?.lat,
                    y: newAlert.location?.lng,
                    sender_id: newAlert.senderId,
                    receiver_id: newAlert.receiverId,
                    ts: newAlert.timestamp,
                    reason: newAlert.reason
                });
                console.log(`🚨 SOS ALERT CREATED: ${alertId}`);
            }
        }

        // 5. Validation (Relaxed for auto-creation, but strict for updates)
        // Only update sensor data if fields are present
        if (temperature !== undefined && humidity !== undefined) {
            // Calculate status if not provided
            if (!status && temperature) {
                status = calculateStatus(temperature, humidity);
            }

            // Store in Time-Series Collection
            const newHistory = new SensorHistory({
                laneId: String(normalizedLaneId),
                temperature,
                humidity,
                heatIndex: heatIndex || 0,
                status,
                count: count || 0,
                cardId
            });
            await newHistory.save();

            // Prepare Update Data for Fast Lookup (Lane Collection)
            const updateData = {
                temperature,
                humidity,
                heatIndex: heatIndex || 0,
                crowdCount: count || 0,
                status,
                lastUpdated: new Date()
            };

            // Update location if provided
            if (receiver_coord) {
                updateData.location = { lat: receiver_coord.x, lng: receiver_coord.y };
            }

            // Database Update
            const updatedLane = await Lane.findOneAndUpdate(
                { laneId: String(normalizedLaneId) },
                updateData,
                { new: true }
            );

            // Real-time Emit
            io.emit('lane-update', updatedLane);
            console.log(`📡 Emitted update for Normalized: ${normalizedLaneId} (Raw: ${req.body.laneId})`);

            return res.json({ success: true, data: updatedLane });
        }

        res.json({ success: true, message: 'Event processed' });

    } catch (err) {
        console.error('🔥 SERVER ERROR in /update-sensor:', err);
        res.status(500).json({
            error: 'Internal Server Error',
            details: err.message
        });
    }
};

app.post('/api/lanes/update-sensor', handleSensorUpdate);
app.post('/api/sensor-data', handleSensorUpdate);
app.post('/api/v1/detections', handleSensorUpdate); // Alias for new requirement
app.post('/api/v1/alerts', handleSensorUpdate); // Alias for new requirement

// 6. Aggregated Heatmap Data (New Endpoint)
app.get('/api/heatmap/aggregated', async (req, res) => {
    try {
        const pipeline = [
            { $sort: { timestamp: -1 } }, // Sort by newest first
            {
                $group: {
                    _id: "$laneId", // Group by Lane ID
                    latestReport: { $first: "$$ROOT" } // Take the first (newest) doc
                }
            },
            { $replaceRoot: { newRoot: "$latestReport" } } // Flatten result
        ];

        const aggregatedData = await SensorHistory.aggregate(pipeline);
        res.json(aggregatedData);
    } catch (err) {
        console.error('Error in aggregation:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Alert Endpoints ---
app.get('/api/alerts', async (req, res) => {
    try {
        const alerts = await Alert.find({ status: { $ne: 'resolved' } }).sort({ timestamp: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/alerts/:id/ack', async (req, res) => {
    try {
        const alert = await Alert.findOneAndUpdate(
            { alertId: req.params.id },
            { status: 'acknowledged' },
            { new: true }
        );
        if (alert) {
            io.emit('alert_status', { alert_id: alert.alertId, status: 'acknowledged' });
            res.json(alert);
        } else {
            res.status(404).json({ error: 'Alert not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/alerts/:id/resolve', async (req, res) => {
    try {
        const alert = await Alert.findOneAndUpdate(
            { alertId: req.params.id },
            { status: 'resolved' },
            { new: true }
        );
        if (alert) {
            io.emit('alert_status', { alert_id: alert.alertId, status: 'resolved' });
            res.json(alert);
        } else {
            res.status(404).json({ error: 'Alert not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Socket.io ---
io.on('connection', (socket) => {
    console.log('🔌 Client Connected:', socket.id);
    socket.on('disconnect', () => console.log('❌ Client Disconnected:', socket.id));
});

// --- Start Server ---
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
