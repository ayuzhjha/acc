const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Badge = require('../models/Badge');

// @route   GET api/challenges
// @desc    Get all challenges
// @access  Public
router.get('/challenges', async (req, res) => {
    try {
        const challenges = await Challenge.find().sort({ createdAt: -1 });
        res.json(challenges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/challenges/latest
// @desc    Get latest challenge (Weekly)
// @access  Public
router.get('/challenges/latest', async (req, res) => {
    try {
        const challenge = await Challenge.findOne().sort({ createdAt: -1 });
        res.json(challenge);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
    try {
        // 1. Get top users (excluding admin and owner)
        const users = await User.find({ role: 'user' })
            .select('name email points streak badges avatarUrl profilePicture solvedChallenges role')
            .populate('badges.badge')
            .sort({ points: -1 })
            .limit(50);

        // 2. Get admins (excluding owner)
        const admins = await User.find({ role: 'admin' })
            .select('name email points streak badges avatarUrl profilePicture solvedChallenges role')
            .populate('badges.badge');

        // 3. Combine: Users first, then Admins at the bottom
        res.json([...users, ...admins]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/badges
// @desc    Get all badges
// @access  Public
router.get('/badges', async (req, res) => {
    try {
        const badges = await Badge.find();
        res.json(badges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/user/:id
// @desc    Get user by ID
// @access  Public
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('badges.badge');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Calculate rank
        const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;

        res.json({ ...user.toObject(), rank });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
