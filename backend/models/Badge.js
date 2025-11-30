const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true // Emoji or URL
    },
    rarity: {
        type: String,
        enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'special'],
        default: 'common'
    },
    type: {
        type: String,
        enum: ['achievement', 'streak', 'rank', 'community', 'special'],
        default: 'achievement'
    },
    criteria: {
        type: String, // Description of how to earn it (for admin reference)
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);
