const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensure no topics have the same name
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the 'Category' model
    }],
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

module.exports = mongoose.model('Topic', topicSchema);
