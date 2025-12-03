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
        validate: {
            validator: function (v) {
                return /@stu\.xim\.edu\.in$/.test(v);
            },
            message: props => `${props.value} is not a valid university email! Must end with @stu.xim.edu.in`
        }
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
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
    role: {
        type: String,
        enum: ['user', 'admin'],
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
