const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                return /^(https?|ftp):\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(value);
            },
            message: 'Invalid content URL',
        },
    },
    contentType: {
        type: String,
        required: true,
        enum: ['image', 'video-youtube', 'document-txt'], // Allowed content types
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic', // Reference to the 'Topic' model
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the 'User' model
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Content', contentSchema);