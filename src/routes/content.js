const express = require('express');
const router = express.Router();

// Import middleware
const verifyTokenAndPermissions = require('../middlewares/verifyTokenAndPermissions');

// Import the Content controller
const ContentController = require('../controllers/ContentController'); // Assuming controllers folder

// Protect all child routes under '/content'
// router.use('/', verifyTokenAndPermissions);

// Define Content routes
router.post('/', ContentController.createContent);
router.get('/', ContentController.getContents);
router.get('/:id', ContentController.getContent);
router.put('/:id', ContentController.updateContent);
router.delete('/:id', ContentController.deleteContent);

module.exports = router;