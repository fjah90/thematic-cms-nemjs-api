const express = require('express');
const router = express.Router();

// Import middleware
const verifyTokenAndPermissions = require('../middlewares/verifyTokenAndPermissions');

// Import the Category controller
const CategoryController = require('../controllers/CategoryController'); // Assuming controllers folder

// Protect all child routes under '/categories'
router.use('/', verifyTokenAndPermissions);

// Define Category routes
router.post('/', CategoryController.createCategory);
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;