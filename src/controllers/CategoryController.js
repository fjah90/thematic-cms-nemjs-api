const Category = require('../models/Category'); // Assuming Category model in models folder
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

// Schema for category creation
const createCategorySchema = joi.object({
    name: joi.string().trim().required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'string.required': 'Name is required',
    }),
    contentType: joi.string().valid('images', 'videos-youtube', 'documents-txt').required().messages({
        'string.base': 'Content type must be a string',
        'string.empty': 'Content type cannot be empty',
        'string.required': 'Content type is required',
        'string.valid': 'Invalid content type. Allowed values: images, videos-youtube, documents-txt',
    })
});

// Create Category
exports.createCategory = async (req, res) => {
    try {
        // Validate request body using the schema
        const { error } = createCategorySchema.validate(req.body);
        if (error) {
            return handleError(error, res);
        }

        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).send(newCategory); // Created successfully
    } catch (err) {
        handleError(err, res);
    }
};

// Schema for category update
const updateCategorySchema = joi.object({
    name: joi.string().trim().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
    }),
    contentType: joi.string().valid('images', 'videos-youtube', 'documents-txt').messages({
        'string.base': 'Content type must be a string',
        'string.valid': 'Invalid content type. Allowed values: images, videos-youtube, documents-txt',
    })
});

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        // Validate request body using the schema
        const { error } = updateCategorySchema.validate(req.body);
        if (error) {
            return handleError(error, res);
        }

        const categoryId = req.params.id;
        const updates = req.body;
        const options = { new: true }; // Return the updated document

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updates, options);
        if (!updatedCategory) {
            return res.status(404).send({ message: 'Category not found' });
        }
        res.status(200).send(updatedCategory);
    } catch (err) {
        handleError(err, res);
    }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).send(categories);
    } catch (err) {
        handleError(err, res);
    }
};

// Get Category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).send({ message: 'Category not found' });
        }
        res.status(200).send(category);
    } catch (err) {
        handleError(err, res);
    }
};


// Delete Category
exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    
    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) return res.status(404).send({ message: 'Category not found' });
       
        res.send({ message: 'Category deleted successfully' });
    } catch (err) {
        handleError(err, res);
    }
};
