const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'nirikshansetu_sih_gov_secret_key_2026_safe_jwt';

const authMiddleware = async (req, res, next) => {
    try {
        let token = null;

        // 1. Check HTTP-only cookie
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } 
        // 2. Fallback to Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No authentication token provided.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch user from DB if Mongoose connected, or attached decoded data
        if (decoded.id) {
            let user = null;
            if (process.env.IS_MEM_STORE) {
                user = global.inMemoryUsers ? global.inMemoryUsers.find(u => u.id === decoded.id) : null;
            } else {
                try {
                    user = await User.findById(decoded.id).select('-password');
                } catch (e) {
                    user = null;
                }
            }

            if (user) {
                req.user = typeof user.toPublicJSON === 'function' ? user.toPublicJSON() : user;
                return next();
            }
        }

        // Fallback decoded payload
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired session token. Please log in again.' 
        });
    }
};

module.exports = authMiddleware;
