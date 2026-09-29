require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nirikshansetu';

const seedAdmin = async () => {
    try {
        console.log('Connecting to MongoDB for seeding...');
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully.');

        const adminEmail = 'admin@dosje.gov.in';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`[SEED] Admin account (${adminEmail}) already exists.`);
        } else {
            const adminUser = new User({
                email: adminEmail,
                password: 'Admin@123456', // will be hashed automatically by pre-save hook
                fullName: 'Rajesh Kumar Sharma',
                role: 'Government Administrator',
                department: 'Ministry of Social Justice & Empowerment',
                profileImage: '',
                status: 'Active'
            });

            await adminUser.save();
            console.log(`[SEED] Government Administrator account created successfully:`);
            console.log(`  Email    : ${adminEmail}`);
            console.log(`  Password : Admin@123456`);
        }

        process.exit(0);
    } catch (err) {
        console.error('[SEED ERROR]', err.message);
        process.exit(1);
    }
};

seedAdmin();
