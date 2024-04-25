const { userPermissions } = require('../config/UserPermissions');

const verifyUserPermissions = (requiredPermission) => {
    return (req, res, next) => {
        // Check for user presence after verificationToken might have populated it
        if (!req.user) {
            return res.status(401).json({ error: 'No User Unauthorized' }); // Use JSON response
        }

        const userType = req.user.userType; // Assuming userType property exists on the user object

        // Assign user permissions based on userType (cleaner approach)
        const userRolePermissions = userPermissions[userType] || {};
        req.userPermissions = userRolePermissions;

        // Check permission using destructuring (optional)
        if (!userRolePermissions || !userRolePermissions[requiredPermission]) {
            return res.status(403).json({ error: 'Insufficient permissions' }); // Use JSON response
        }

        next();
    };
};

module.exports = verifyUserPermissions;