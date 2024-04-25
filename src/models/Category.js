const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensure no categories have the same name
    },
    contentType: {
        type: String,
        required: true,
        enum: ['images', 'videos-youtube', 'documents-txt'], // Allowed content types
    },
});

module.exports = mongoose.model('Category', categorySchema);