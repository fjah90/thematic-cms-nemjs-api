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
    permissions: {
        images: {
            type: Boolean,
            default: false,
        },
        videos: {
            type: Boolean,
            default: false,
        },
        texts: {
            type: Boolean,
            default: false,
        },
    },
});

module.exports = mongoose.model('Category', categorySchema);