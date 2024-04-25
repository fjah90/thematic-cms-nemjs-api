const jwt = require('jsonwebtoken');
const userPermissions = require('../config/UserPermissions');

const verifyTokenAndPermissions = async (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    // Check if token is present
    if (!token) {
        return res.status(401).json({ error: 'Missing authentication token' });
    }

    try {
        // Verify the token using the JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is expired
        const now = Date.now();
        if (decoded.exp < now / 1000) {
            return res.status(401).json({ error: 'Token is expired' });
        }

        // Assign user permissions based on userType
        const userType = decoded.userType || 'reader'; // Default to 'reader' if userType missing
        const userRolePermissions = userPermissions[userType] || {};
        
        console.log('User permissions:', userRolePermissions);
        const httpMethod = req.method; // Access the HTTP method
        console.log('User attempted to access route with method:', httpMethod); // Optional logging
        // Check permission using destructuring 
        if (!userRolePermissions || !userRolePermissions[httpMethod]) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        console.log(userRolePermissions[httpMethod])

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        // Handle token verification errors
        switch (error.name) {
            case 'JsonWebTokenError':
                return res.status(401).json({ error: 'Invalid token signature' });
            case 'TokenExpiredError':
                return res.status(401).json({ error: 'Token is expired' });
            default:
                console.error('Unhandled token verification error:', error);
                return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = verifyTokenAndPermissions;