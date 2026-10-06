const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'drishti360_sih_gov_secret_key_2026_safe_jwt';

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate Administrator & Set HTTP-Only Cookie
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email address and password.'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        let user = null;
        let isMatch = false;

        if (process.env.IS_MEM_STORE) {
            user = (global.inMemoryUsers || []).find(u => u.email === normalizedEmail);
            if (user) {
                isMatch = await bcrypt.compare(password, user.password);
            }
        } else {
            try {
                user = await User.findOne({ email: normalizedEmail });
                if (user) {
                    isMatch = await user.comparePassword(password);
                }
            } catch (err) {
                console.error('[AUTH DB ERR]', err.message);
                // Try fallback in-memory matching if DB fails
                user = (global.inMemoryUsers || []).find(u => u.email === normalizedEmail);
                if (user) {
                    isMatch = await bcrypt.compare(password, user.password);
                }
            }
        }

        if (!user || !isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email address or password. Please verify your credentials.'
            });
        }

        if (user.status === 'Inactive') {
            return res.status(403).json({
                success: false,
                message: 'Your administrator account has been deactivated. Please contact DoSJE IT support.'
            });
        }

        // Format public user object
        const publicUser = typeof user.toPublicJSON === 'function' 
            ? user.toPublicJSON() 
            : {
                id: user.id || user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                department: user.department,
                profileImage: user.profileImage || '',
                initials: user.initials || 'RKS',
                status: user.status
            };

        // Update last login date
        if (user.save && typeof user.save === 'function') {
            user.lastLogin = new Date();
            await user.save();
        }

        // Expiration
        const expiresIn = rememberMe ? '7d' : '24h';
        const maxAgeMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

        // Sign JWT
        const token = jwt.sign(publicUser, JWT_SECRET, { expiresIn });

        // Set HTTP-Only Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: maxAgeMs
        });

        return res.json({
            success: true,
            message: 'Authentication successful. Welcome back!',
            user: publicUser,
            token
        });

    } catch (err) {
        console.error('[LOGIN ERR]', err);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred during authentication.'
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get Currently Authenticated Administrator Profile
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        return res.json({
            success: true,
            user: req.user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve session user details.'
        });
    }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update Authenticated Admin's Profile
 * @access  Private
 */
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { fullName, email, profileImage } = req.body;
        const userId = req.user.id;

        if (!fullName || !fullName.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Full Name cannot be empty.'
            });
        }

        let updatedUser = null;

        if (process.env.IS_MEM_STORE) {
            const idx = (global.inMemoryUsers || []).findIndex(u => u.id === userId);
            if (idx !== -1) {
                global.inMemoryUsers[idx].fullName = fullName.trim();
                if (email) global.inMemoryUsers[idx].email = email.trim().toLowerCase();
                if (profileImage !== undefined) global.inMemoryUsers[idx].profileImage = profileImage.trim();

                const nameParts = fullName.trim().split(' ');
                global.inMemoryUsers[idx].initials = nameParts.length > 1 
                    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
                    : nameParts[0].substring(0, 2).toUpperCase();

                updatedUser = global.inMemoryUsers[idx];
            }
        } else {
            try {
                const user = await User.findById(userId);
                if (user) {
                    user.fullName = fullName.trim();
                    if (email) user.email = email.trim().toLowerCase();
                    if (profileImage !== undefined) user.profileImage = profileImage.trim();
                    await user.save();
                    updatedUser = user.toPublicJSON();
                }
            } catch (err) {
                console.error('[PROFILE DB UPDATE ERR]', err.message);
            }
        }

        if (!updatedUser) {
            // Fallback updated profile if DB fails
            const nameParts = fullName.trim().split(' ');
            const initials = nameParts.length > 1 
                ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
                : nameParts[0].substring(0, 2).toUpperCase();

            updatedUser = {
                ...req.user,
                fullName: fullName.trim(),
                email: email ? email.trim().toLowerCase() : req.user.email,
                profileImage: profileImage !== undefined ? profileImage.trim() : req.user.profileImage,
                initials
            };
        }

        // Refresh JWT with updated profile
        const token = jwt.sign(updatedUser, JWT_SECRET, { expiresIn: '24h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: 'Profile updated successfully.',
            user: updatedUser
        });

    } catch (err) {
        console.error('[PROFILE UPDATE ERR]', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to update user profile.'
        });
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Invalidate Session & Clear Auth Cookie
 * @access  Private / Public
 */
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    return res.json({
        success: true,
        message: 'Logged out successfully.'
    });
});

module.exports = router;
