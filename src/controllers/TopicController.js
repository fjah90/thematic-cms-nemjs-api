const Category = require('../models/Category');
const Topic = require('../models/Topic');
const joi = require('joi');
const logger = require('../config/WistonConfig');

const handleError = (err, res) => {
    logger.error(err);
    if (err.code === 11000) {
        // Handle duplicate key error
        return res.status(400).send('Duplicate name, already in use');
    } else {
        res.status(400).send({ message: 'Validation error', errors: err.details });
    }
};

// Validation schema for creating a topic
const createTopicSchema = joi.object({
    name: joi.string().trim().required().messages({
        'string.empty': 'Name cannot be empty',
        'string.required': 'Name is required',
    }),
    categories: joi.array().items(joi.string().length(24).hex().message('Invalid category ID')),
    permissions: joi.object({
        images: joi.boolean().optional(),
        videos: joi.boolean().optional(),
        texts: joi.boolean().optional(),
    }),
});

// Create a new topic
exports.createTopic = async (req, res) => {
    // Validate request body
    const { error } = createTopicSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { name, categories, permissions } = req.body;

    // Check if categories exist
    const validCategories = await Category.find({ _id: { $in: categories } });
    if (validCategories.length !== categories.length) {
        return res.status(400).send({ message: 'Invalid category IDs' });
    }

    const newTopic = new Topic({ name, categories, permissions });
    try {
        await newTopic.save();
        res.status(201).send(newTopic);
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
};

// Get all topics
exports.getTopics = async (req, res) => {
    try {
        // Get total count of topics
        const topicCount = await Topic.countDocuments();

        // Fetch topics 
        const topics = await Topic.find().populate('categories');

        res.status(200).send({
            counts: topicCount,
            data: topics,
        });
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
};

// Get a specific topic
exports.getTopic = async (req, res) => {
    const topicId = req.params.id;
    try {
        const topic = await Topic.findById(topicId).populate('categories');
        if (!topic) return res.status(404).send({ message: 'Topic not found' });
        res.status(200).send(topic);
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
};


// Validation schema for updating a topic (partial updates)
const updateTopicSchema = joi.object({
    name: joi.string().trim().optional().messages({
        'string.empty': 'Name cannot be empty',
    }),
    categories: joi.array().items(joi.string().length(24).hex().message('Invalid category ID')).optional(),
    permissions: joi.object({
        images: joi.boolean().optional(),
        videos: joi.boolean().optional(),
        texts: joi.boolean().optional(),
    })
});
// Update a topic
exports.updateTopic = async (req, res) => {
    const topicId = req.params.id;

    // Validate request body (partial updates)
    const { error } = updateTopicSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const updates = req.body;

    try {
        const updatedTopic = await Topic.findByIdAndUpdate(topicId, updates, { new: true });
        if (!updatedTopic) return res.status(404).send({ message: 'Topic not found' });
        res.status(200).send(updatedTopic);
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
};



// Delete a topic
exports.deleteTopic = async (req, res) => {
    const topicId = req.params.id;

    try {
        const deletedTopic = await Topic.findByIdAndDelete(topicId);
        if (!deletedTopic) return res.status(404).send({ message: 'Topic not found' });

        res.status(200).send({ message: 'Topic deleted successfully' });
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
};


