const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: 'General'
    },
    type: {
        type: String,
        enum: ['platform', 'custom'],
        default: 'platform'
    },
    externalLink: {
        type: String // For platform challenges (HackerRank, LeetCode)
    },
    resourceLink: {
        type: String // For custom challenges (PDF, Image, etc.)
    },
    testCases: [{
        input: String,
        output: String
    }],
    deadline: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'upcoming', 'ended'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
