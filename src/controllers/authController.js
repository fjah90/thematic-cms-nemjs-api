const User = require('../models/User');
const bcrypt = require('bcrypt');
const joi = require('joi');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        // Validate user input using Joi
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Check for existing user with the same email (optional)
        const existingEmail= await User.findOne({ email: req.body.email });
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
        // console.error(error);
        if (error.code === 11000) {
            // Handle duplicate key error
            return res.status(400).send('Username already in use');
        } else {
            // Handle other errors
            console.error(error);
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
        console.error(error);
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
    console.info('Users Route');

    try {
        const users = await User.find(); // Fetch all users

        res.send(users); // Send all user data (consider security implications)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

// authController.js (assuming this is the location)
const getUser = async (req, res) => {
    console.info('User Route');

    try {
        const users = await User.find(); // Fetch all users

        res.send(users); // Send all user data (consider security implications)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

const updateUser = async (req, res) => {
    console.info('User update Route');

    try {
        const userId = req.params.id; // Get user ID from request parameter
        const updates = req.body; // Get update data from request body

        // Check if password is being updated
        if (updates.password) {
            // Validate password by comparing hashes
            const existingUser = await User.findById(userId);
            if (!existingUser) return res.status(404).send('User not found');

            // Hash the new password
            const salt = await bcrypt.genSalt(10); // Generate salt with a cost factor of 10
            const hashedNewPassword = await bcrypt.hash(updates.password, salt); // Hash the new password using the salt

            // Compare hashes
            const isPasswordValid = await bcrypt.compare(hashedNewPassword, existingUser.password);
            if (!isPasswordValid) return res.status(401).send('Incorrect password');

            // Password is valid, proceed with updating
            delete updates.password; // Remove password from updates object (bcrypt already hashed it)
        }

        // Update the user with the modified updates object
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!user) return res.status(404).send('User not found');

        res.send(user); // Send updated user data
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

const deleteUser = async (req, res) => {
    console.info('User delete Route');

    try {
        const userId = req.params.id; // Get user ID from request parameter

        const user = await User.findByIdAndDelete(userId); // Find and delete user

        if (!user) return res.status(404).send('User not found');

        res.send({ message: 'User deleted successfully' }); // Send success message
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

module.exports = { login, register, getUsers, getUser, updateUser, deleteUser }; // Export the function
