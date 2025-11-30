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
        const users = await User.find()
            .select('name email points streak badges avatarUrl solvedChallenges')
            .populate('badges.badge')
            .sort({ points: -1 })
            .limit(50);
        res.json(users);
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

        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
