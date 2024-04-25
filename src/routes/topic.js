const express = require('express');
const router = express.Router();

// Import middleware (assuming it's the same)
const verifyTokenAndPermissions = require('../middlewares/verifyTokenAndPermissions');

// Import the Topic controller (assuming controllers folder)
const TopicController = require('../controllers/TopicController');

// Protect all child routes under '/topics' (similar to categories)
router.use('/', verifyTokenAndPermissions);

// Define Topic routes
router.post('/', TopicController.createTopic);
router.get('/', TopicController.getTopics);
router.get('/:id', TopicController.getTopic);
router.put('/:id', TopicController.updateTopic);
router.delete('/:id', TopicController.deleteTopic);

module.exports = router;
