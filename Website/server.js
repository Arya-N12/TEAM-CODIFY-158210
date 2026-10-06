require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/drishti360';

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));

// In-Memory Fallback Seed Initialization (guarantees zero breakdown if MongoDB is offline)
const initInMemoryFallback = async () => {
    process.env.IS_MEM_STORE = 'true';
    const hashed = await bcrypt.hash('Admin@123456', 10);
    global.inMemoryUsers = [
        {
            id: 'usr-admin-01',
            email: 'admin@dosje.gov.in',
            password: hashed,
            fullName: 'Rajesh Kumar Sharma',
            role: 'Government Administrator',
            department: 'Ministry of Social Justice & Empowerment',
            profileImage: '',
            initials: 'RKS',
            status: 'Active',
            lastLogin: new Date()
        }
    ];
    console.log('[AUTH] System running with active memory storage (Demo Admin: admin@dosje.gov.in / Admin@123456)');
};

// MongoDB Connection & Seeding
mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 2000
}).then(async () => {
    console.log('[DATABASE] MongoDB connected successfully at:', MONGO_URI);
    // Seed default admin if missing
    try {
        const adminCount = await User.countDocuments({ role: 'Government Administrator' });
        if (adminCount === 0) {
            const admin = new User({
                email: 'admin@dosje.gov.in',
                password: 'Admin@123456',
                fullName: 'Rajesh Kumar Sharma',
                role: 'Government Administrator',
                department: 'Ministry of Social Justice & Empowerment',
                status: 'Active'
            });
            await admin.save();
            console.log('[SEED] Default Government Administrator created in MongoDB (admin@dosje.gov.in)');
        }
    } catch (err) {
        console.error('[SEED WARN]', err.message);
    }
}).catch(err => {
    console.warn('[DATABASE WARN] Local MongoDB connection failed or offline:', err.message);
    initInMemoryFallback();
});

// Authentication API Routes
app.use('/api/auth', authRoutes);

// Serve static frontend files from 'drishti360' folder
app.use(express.static(path.join(__dirname, 'drishti360')));

// SPA fallback route
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'drishti360', 'index.html'));
});

// Start Express Server
const server = app.listen(PORT, () => {
    console.log(`
=============================================================
  Drishti360 — Smart Inspection & Monitoring System
  Express Server & Authentication Engine Active
=============================================================
  Local Dashboard URL : http://localhost:${PORT}
  Auth API Endpoint   : http://localhost:${PORT}/api/auth
  Default Admin       : admin@dosje.gov.in / Admin@123456
=============================================================
    `);
});

// EADDRINUSE error handling
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n[ERROR] Port ${PORT} is already in use by another process.`);
        console.error(`To use port 5001, run: $env:PORT=5001; npm start\n`);
    } else {
        console.error('\n[ERROR] Server startup error:', err);
    }
});
