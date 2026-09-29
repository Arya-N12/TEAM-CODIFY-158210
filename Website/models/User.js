const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        default: 'Rajesh Kumar Sharma'
    },
    role: {
        type: String,
        required: true,
        default: 'Government Administrator'
    },
    department: {
        type: String,
        default: 'Ministry of Social Justice & Empowerment'
    },
    profileImage: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Hash password before saving if modified
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Helper for initials
userSchema.methods.toPublicJSON = function () {
    const nameParts = (this.fullName || 'Admin User').split(' ');
    const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : nameParts[0].substring(0, 2).toUpperCase();

    return {
        id: this._id ? this._id.toString() : this.id,
        email: this.email,
        fullName: this.fullName,
        role: this.role,
        department: this.department,
        profileImage: this.profileImage,
        initials,
        status: this.status,
        lastLogin: this.lastLogin
    };
};

module.exports = mongoose.model('User', userSchema);
