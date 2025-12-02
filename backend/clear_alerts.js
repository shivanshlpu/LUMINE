const mongoose = require('mongoose');
const Alert = require('./models/Alert');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jaganbhakti900_db_user:shivansh900@shiva100.9apjqfr.mongodb.net/lumine?appName=shiva100';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to DB');
        const res = await Alert.deleteMany({});
        console.log(`Deleted ${res.deletedCount} alerts.`);
        mongoose.disconnect();
    })
    .catch(err => console.error(err));
