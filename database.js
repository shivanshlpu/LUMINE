// File Name: server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());

// --- MONGODB CONNECTION ---
mongoose.connect('mongodb+srv://indianrelationship900_db_user:shivansh900@cluster0.8tardyd.mongodb.net/?appName=Cluster0')
.then(() => {
    console.log('✅ MongoDB Connected Successfully');
    createDefaultUser(); 
})
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ==========================================
// 1. DATABASE SCHEMAS (MODELS)
// ==========================================

// User Schema
const userSchema = new mongoose.Schema({
    login_id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['devotee', 'mandir_admin', 'security_guard', 'parking_incharge', 'group_account'],
        required: true 
    },
    linked_booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    created_at: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
    booking_id: { type: String, unique: true },
    darshan_date: { type: Date, required: true },
    time_slot: { type: String, required: true },
    members: [{
        name: String,
        age: Number,
        aadhaar_mask: String,
        aadhaar_ref: String,
        email: String
    }],
    contact: { primary_email: String, mobile: String },
    travel: { mode: String, vehicle_number: String, arrival_time: String },
    status: { type: String, default: 'confirmed' },
    created_at: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// Slot Schema (To manage capacity)
const slotSchema = new mongoose.Schema({
    date: { type: String, required: true },
    slot_time: { type: String, required: true },
    total_capacity: { type: Number, default: 500 },
    booked_count: { type: Number, default: 0 }
});
const Slot = mongoose.model('Slot', slotSchema);

// Aadhaar Log Schema
const aadhaarLogSchema = new mongoose.Schema({
    aadhaar_input: String,
    status: String,
    created_at: { type: Date, default: Date.now, expires: 600 }
});
const AadhaarLog = mongoose.model('AadhaarLog', aadhaarLogSchema);

// ==========================================
// 2. DEFAULT USER SEEDING (shiva900)
// ==========================================
async function createDefaultUser() {
    try {
        const existingUser = await User.findOne({ login_id: 'shiva900' });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('shivansh', 10);
            const newUser = new User({
                login_id: 'shiva900',
                password: hashedPassword,
                role: 'devotee' 
            });
            await newUser.save();
            console.log("👤 Default User Created: ID=shiva900 | Pass=shivansh");
        } else {
            console.log("ℹ️ Default User (shiva900) already exists.");
        }
    } catch (error) {
        console.error("Error creating user:", error);
    }
}

// ==========================================
// 3. API ENDPOINTS
// ==========================================

// --- LOGIN API ---
app.post('/api/auth/login', async (req, res) => {
    const { user_id, password, role } = req.body;

    try {
        const user = await User.findOne({ login_id: user_id });
        if (!user) return res.status(401).json({ error: "User ID not found" });

        // Check Role
        if (user.role !== role && user.role !== 'group_account') {
            return res.status(403).json({ error: "Role Mismatch! Incorrect user type." });
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect Password" });

        // Decide Redirect URL (UPDATED HERE)
        let redirectUrl = 'dashboard.html'; // ✅ अब यह bookingslot.html पर जाएगा
        if (user.role === 'mandir_admin') redirectUrl = 'admin.html';

        res.json({
            success: true,
            token: "temp-jwt-token-" + Date.now(),
            role: user.role,
            redirectUrl: redirectUrl 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// --- AADHAAR VERIFY API ---
app.post('/api/aadhaar/verify', async (req, res) => {
    const { aadhaar_number } = req.body;
    if (!aadhaar_number || aadhaar_number.length !== 12) {
        return res.json({ ok: false, error: "Invalid Length" });
    }
    await AadhaarLog.create({ aadhaar_input: aadhaar_number, status: 'attempted' });
    
    // Demo Logic: If 000000000000, fail. Else pass.
    if (aadhaar_number === '000000000000') return res.json({ ok: false, verified: false });

    res.json({
        ok: true,
        verified: true,
        mask: `XXXX-XXXX-${aadhaar_number.slice(-4)}`,
        reference_id: `DLK-${Date.now()}`
    });
});

// --- BOOKING SUBMISSION API ---
app.post('/api/bookings/devotee', async (req, res) => {
    const { date, time_slot, members, travel, contact } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Check Slot Capacity
        let slot = await Slot.findOne({ date, slot_time: time_slot }).session(session);
        if (!slot) slot = new Slot({ date, slot_time: time_slot });

        if (slot.booked_count + members.length > slot.total_capacity) {
            throw new Error("Slot Full! Please choose another time.");
        }

        // 2. Create Booking
        const bookingId = `BK-${Date.now()}`;
        const newBooking = new Booking({
            booking_id: bookingId,
            darshan_date: date,
            time_slot,
            members,
            travel,
            contact
        });
        await newBooking.save({ session });

        // 3. Create Group Login for the Devotee
        const groupLoginId = `SMN-${Math.floor(10000 + Math.random() * 90000)}`;
        const rawPassword = `OM${Math.floor(1000 + Math.random() * 9000)}`;
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const newUser = new User({
            login_id: groupLoginId,
            password: hashedPassword,
            role: 'group_account',
            linked_booking_id: newBooking._id
        });
        await newUser.save({ session });

        // 4. Update Slot Count
        slot.booked_count += members.length;
        await slot.save({ session });

        await session.commitTransaction();
        
        // 5. Send Response
        res.json({
            success: true,
            booking_id: bookingId,
            group_login_id: groupLoginId,
            group_password_plain: rawPassword
        });

    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ error: err.message });
    } finally {
        session.endSession();
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));