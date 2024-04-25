const User = require('../models/User');
const bcrypt = require('bcrypt');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const logger = require('../config/WistonConfig');

const register = async (req, res) => {
    try {
        // Validate user input using Joi
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Check for existing user with the same email (optional)
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) return res.status(400).send('Email already in use');

        // Create a new user
        const user = new User(req.body);

        // Hash the password before saving using bcrypt
        const salt = await bcrypt.genSalt(10); // Generate salt with a cost factor of 10
        user.password = await bcrypt.hash(user.password, salt); // Hash the password using the salt

        // Save the new user to the database
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_TIME });

        // Send successful response with token
        res.send({ message: 'User created successfully', token });

    } catch (error) {
        // logger.error(error);
        if (error.code === 11000) {
            // Handle duplicate key error
            return res.status(400).send('Username already in use');
        } else {
            // Handle other errors
            logger.error(error);
            res.status(500).send('Internal server error');
        }
    }
};

function validateUser(user) {
    const schema = joi.object({
        name: joi.string().min(3).max(50).required(),
        lastName: joi.string().min(1).max(50).optional(), // Make last name optional
        username: joi.string().min(3).max(20).required(),
        email: joi.string().email().lowercase().required(),
        password: joi.string().min(6).required(),
        userType: joi.string().valid('admin', 'creator', 'reader').required(), // Validate user type
    });

    return schema.validate(user);
}

const login = async (req, res) => {
    try {
        // Validate user input using Joi
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Find the user by username or email
        const user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
        if (!user) return res.status(401).send('Invalid credentials'); // More specific message

        // Validate password using bcrypt.compare
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send('Invalid credentials'); // More specific message

        // Generate a JWT token
        const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_TIME });

        // Send successful response with token
        res.send({ message: 'Login successful', token });

    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal server error');
    }
};

function validateLogin(user) {
    const schema = joi.object({
        email: joi.string().email().lowercase().optional(),
        username: joi.string().alphanum().min(3).max(20).optional(), // Add username validation
        password: joi.string().required(),
    });

    return schema.validate(user);
}

const getUsers = async (req, res) => {
    logger.info('Users Route');

    try {
        // const users = await User.find({ isDeleted: false }); // Fetch all users
        const users = await User.find({
            $or: [
                { isDeleted: { $exists: false } }, // Check for missing isDeleted field
                { isDeleted: false }, // Filter for users with isDeleted set to false
            ],
        });

        res.send(users); // Send all user data (consider security implications)
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal server error');
    }
};

const getUser = async (req, res) => {
    logger.info('Get User by ID Route');

    try {
        // Extract the ID from the request parameters
        const userId = req.params.id;

        // Find the user with the specified ID
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).send('User not found'); // Handle non-existent user
        }

        res.send(user); // Send only the requested user data
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal server error');
    }
};


const updateUser = async (req, res) => {
    logger.info('User update Route');

    try {
        const userId = req.params.id; // Get user ID from request parameter
        const updates = req.body; // Get update data from request body

        // Validate the request body with Joi
        const { error } = validateUserUpdated(updates);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        // Check if password is being updated
        if (updates.password) {
            // Validate password by comparing hashes
            const existingUser = await User.findById(userId);
            if (!existingUser) return res.status(404).send('User not found');

            const isSameHashedPass = await updates.password === existingUser.password;

            if (isSameHashedPass) {
                // Password is already hashed, no need to re-hash
                logger.info('Password is already hashed and is the same');
                delete updates.password
            } else {
                const isSamePassword = await bcrypt.compare(updates.password, existingUser.password);
                if (isSamePassword) {
                    logger.info('Password is the same')
                    delete updates.password;
                } else {
                    // Password is not hashed, proceed with hashing
                    const salt = await bcrypt.genSalt(10);
                    const hashedNewPassword = await bcrypt.hash(updates.password, salt);
                    updates.password = hashedNewPassword;
                }
            }

        }

        // Update the user with the modified updates object
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!user) return res.status(404).send('User not found');

        res.send({ message: 'User update successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal server error');
    }
};

function validateUserUpdated(user) {
    const schema = joi.object({
        name: joi.string().min(3).max(50).optional(),
        lastName: joi.string().min(1).max(50).optional(), // Make last name optional
        username: joi.string().min(3).max(20).optional(),
        email: joi.string().email().lowercase().optional(),
        password: joi.string().min(6).optional(),
        userType: joi.string().valid('admin', 'creator', 'reader').optional(), // Validate user type
    });

    return schema.validate(user);
}

const deleteUser = async (req, res) => {
    logger.info('User delete Route');

    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).send('User not found');

        await user.deleteUser(); // Soft delete the user
        res.send({ message: 'User deleted successfully' }); // Send success message
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal server error');
    }
};

const getUserDeletes = async (req, res) => {
    logger.info('Users Deletes Route');

    try {
        const users = await User.find({ isDeleted: true });; // Fetch all users

        res.send(users); // Send all user data (consider security implications)
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal server error');
    }
};

module.exports = { login, register, getUsers, getUserDeletes, getUser, updateUser, deleteUser}; // Export the function
