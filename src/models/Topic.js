const mongoose = require('mongoose');
const { reader } = require('../config/UserPermissions');
const { Schema } = mongoose;

const topicSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensure no topics have the same name
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category', // Reference to the 'Category' model
    }],
    userPermissions: {
        admin: {
            read: Boolean,
            write: Boolean,
        },
        creator: {
            read: Boolean,
            write: Boolean,
        },
        reader: {
            read: Boolean,
            write: Boolean,
        },
    },
});

module.exports = mongoose.model('Topic', topicSchema);
