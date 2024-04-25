const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        unique: true, // Ensure username is unique
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
            },
            message: '{VALUE} is not a valid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    userType: {
        type: String,
        required: true,
        enum: ['admin', 'creator', 'reader'] // Define allowed user types
    },
    isDeleted: {
        type: Boolean,
        default: false, // Set default to false for active users
    },
    //TODO: Add other fields as needed (e.g., profile picture, etc.)
});
//TODO: Add methods as needed restore user
userSchema.methods.deleteUser = async function () {
    this.isDeleted = true;
    await this.save();
};

module.exports = mongoose.model('User', userSchema);
