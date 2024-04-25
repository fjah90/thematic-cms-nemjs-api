const express = require('express');
const router = express.Router();

// Import the logic controllers
const authController = require('../controllers/authController');

// Import middleware
const verifyToken = require('../middlewares/verifyToken');
const verifyUserPermissions = require('../middlewares/verifyUserPermissions');
const userPermissions = require('../config/UserPermissions'); // Import from sibling file

// User login
router.post('/login', authController.login);

// User registration
router.post('/register', authController.register);

// Protected routes (require valid token)
router.get('/users/', verifyToken, verifyUserPermissions(userPermissions.admin.get || userPermissions.creator.get), authController.getUsers);
router.get('/users/:id', verifyToken, verifyUserPermissions(userPermissions.admin.get || userPermissions.creator.get), authController.getUser);
router.put('/users/:id', verifyToken, verifyUserPermissions(userPermissions.admin.put || userPermissions.creator.put), authController.updateUser);
router.delete('/users/:id', verifyToken, verifyUserPermissions(userPermissions.admin.delete), authController.deleteUser);

module.exports = router;
