const Content = require('../models/Content');
const joi = require('joi');
const logger = require('../config/WistonConfig'); // Assuming WinstonConfig is your logger configuration

const handleError = (err, res) => {
    logger.error(err);
    if (err.code === 11000) {
        // Handle duplicate key error
        return res.status(400).send('Duplicate content, URL already exists');
    } else {
        res.status(400).send({ message: 'Validation error', errors: err.details });
    }
};

const createContentSchema = joi.object({
    title: joi.string().trim().required().messages({
        'string.empty': 'Title cannot be empty',
        'string.required': 'Title is required',
    }),
    description: joi.string().trim().optional(),
    url: joi.string().required().custom((value, helper) => {
        if (!/^(https?|ftp):\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(value)) {
            return helper.error('Invalid content URL');
        }
        return value;
    }),
    topic: joi.array().items(joi.string().length(24).hex().message('Invalid topic ID')),
    createdBy: joi.array().items(joi.string().length(24).hex().message('Invalid user ID')),
});

// Create a new content
exports.createContent = async (req, res) => {
    // Validate request body
    const { error } = createContentSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { title, description, url, topic, createdBy } = req.body;

    const newContent = new Content({ title, description, url, topic, createdBy });
    try {
        await newContent.save();
        res.status(201).send(newContent);
    } catch (err) {
        handleError(err, res);
    }
};

// Validation schema for updating content (partial updates)
const updateContentSchema = joi.object({
    title: joi.string().trim().optional().messages({
        'string.empty': 'Title cannot be empty',
    }),
    description: joi.string().trim().optional(),
    url: joi.string().optional().custom((value, helper) => {
        if (value && !/^(https?|ftp):\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(value)) {
            return helper.error('Invalid content URL');
        }
        return value;
    }),
    topic: joi.array().items(joi.string().length(24).hex().message('Invalid topic ID')),
});


// Update a content
exports.updateContent = async (req, res) => {
    const contentId = req.params.id;

    // Validate request body (partial updates)
    const { error } = updateContentSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const updates = req.body; // Extract updates from request body

    try {
        const updatedContent = await Content.findByIdAndUpdate(contentId, updates, { new: true });
        if (!updatedContent) return res.status(404).send({ message: 'Content not found' });
        res.status(200).send(updatedContent);
    } catch (err) {
        handleError(err, res);
    }
};

// Get all content
exports.getContents = async (req, res) => {
    try {
        // Get total count of content items
        const contentCount = await Content.countDocuments();
        // Get all content items
        const contents = await Content.find().populate('topic').populate({
            path: 'createdBy',
            select: { name: true, _id: true }
        });
        res.status(200).send({
            counts: contentCount,
            data: contents,
        });
    } catch (err) {
        handleError(err, res);
    }
};

// Get a specific content
exports.getContent = async (req, res) => {
    const contentId = req.params.id;
    try {
        const content = await Content.findById(contentId).populate('topic').populate('createdBy');
        if (!content) return res.status(404).send({ message: 'Content not found' });
        res.status(200).send(content);
    } catch (err) {
        handleError(err, res);
    }
};

// Delete a content
exports.deleteContent = async (req, res) => {
    const contentId = req.params.id;

    try {
        const deletedContent = await Content.findByIdAndDelete(contentId);
        if (!deletedContent) return res.status(404).send({ message: 'Content not found' });

        res.status(200).send({ message: 'Content deleted successfully' });
    } catch (err) {
        logger.error(err);
        handleError(err, res);
    }
};
