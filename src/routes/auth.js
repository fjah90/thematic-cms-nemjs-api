const express = require('express');
const router = express.Router();

// Import the logic controllers
const authController = require('../controllers/AuthController');

// Import middleware
const verifyTokenAndPermissions = require('../middlewares/verifyTokenAndPermissions');

// User login
router.post('/login', authController.login);

// User registration
router.post('/register', authController.register);

// Protect all child routes under '/users'
router.use('/users', verifyTokenAndPermissions);

router.get('/users/', authController.getUsers);
router.get('/users/deletes', authController.getUserDeletes);
router.get('/users/:id', authController.getUser);
router.put('/users/:id', authController.updateUser);
router.delete('/users/:id', authController.deleteUser);

module.exports = router;
