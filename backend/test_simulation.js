const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3000/api/lanes/update-sensor';
const LANE_ID = 'LANE_01';

// Function to generate random data
function generateData() {
    const temp = (25 + Math.random() * 15).toFixed(1); // 25-40
    const humidity = (50 + Math.random() * 40).toFixed(0); // 50-90

    // Simple Heat Index Calc (Approximate)
    const heatIndex = (parseFloat(temp) + (parseFloat(humidity) / 10)).toFixed(1);

    let status = 'GREEN';
    let isSos = false;

    const crowdCount = Math.floor(Math.random() * 250); // 0-250 people

    if (heatIndex > 35) status = 'RED';
    if (crowdCount > 150) status = 'RED'; // Overcrowd
    else if (crowdCount > 50) status = 'YELLOW'; // Moderate

    if (Math.random() > 0.95) isSos = true; // 5% chance of SOS

    return {
        laneId: LANE_ID,
        temperature: parseFloat(temp),
        humidity: parseFloat(humidity),
        heatIndex: parseFloat(heatIndex),
        crowdCount: crowdCount,
        status: status,
        isSos: isSos
    };
}

// Send Data Loop
async function sendData() {
    const data = generateData();
    console.log('📤 Sending:', data);

    try {
        const response = await axios.post(API_URL, data);
        console.log('✅ Server Response:', response.status, response.data.success ? 'Success' : 'Failed');
    } catch (error) {
        console.error('❌ Error Sending Data:', error.message);
        if (error.response) {
            console.error('   Server responded with:', error.response.status, error.response.data);
        }
    }
}

// Run every 3 seconds
console.log('🚀 Starting ESP32 Simulation (Flat Schema)...');
setInterval(sendData, 3000);
