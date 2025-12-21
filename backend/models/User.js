const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        // Removed validation to allow any email
    },
    password: {
        type: String,
        required: true
    },
    collegeName: {
        type: String,
        default: ''
    },
    graduationYear: {
        type: Number,
    },
    otp: {
        type: String,
        select: false
    },
    otpExpires: {
        type: Date,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    age: {
        type: Number,
        required: true,
        min: 1
    },
    isAcmMember: {
        type: Boolean,
        default: false
    },
    acmId: {
        type: String,
        required: function () { return this.isAcmMember; } // Required if isAcmMember is true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        default: 'Prefer not to say'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'owner'],
        default: 'user'
    },
    points: {
        type: Number,
        default: 0
    },
    streak: {
        type: Number,
        default: 0
    },
    badges: [{
        badge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge'
        },
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],
    solvedChallenges: [{
        challenge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Challenge'
        },
        solvedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
