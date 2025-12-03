const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Badge = require('../models/Badge');

// Middleware to check if admin
// Middleware to check if admin or owner
const adminCheck = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

// Middleware to check if owner
const ownerCheck = (req, res, next) => {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ message: 'Access denied. Owner only.' });
    }
    next();
};

// @route   POST api/admin/challenge
// @desc    Create a challenge
// @access  Private/Admin
router.post('/challenge', auth, adminCheck, async (req, res) => {
    try {
        console.log('Received challenge data:', req.body);
        const newChallenge = new Challenge(req.body);
        const challenge = await newChallenge.save();
        console.log('Challenge saved:', challenge);
        res.json(challenge);
    } catch (err) {
        console.error('Error saving challenge:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/challenge/:id
// @desc    Update a challenge
// @access  Private/Admin
router.put('/challenge/:id', auth, adminCheck, async (req, res) => {
    try {
        const challenge = await Challenge.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(challenge);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/challenge/:id
// @desc    Delete a challenge
// @access  Private/Admin
router.delete('/challenge/:id', auth, adminCheck, async (req, res) => {
    try {
        await Challenge.findByIdAndDelete(req.params.id);
        res.json({ message: 'Challenge removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', auth, adminCheck, async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('badges.badge').sort({ points: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/user/:id
// @desc    Update user (points, badges, streak, email, password)
// @access  Private/Admin
router.put('/user/:id', auth, adminCheck, async (req, res) => {
    try {
        const { points, badges, streak, email, password, profilePicture } = req.body; // badges is array of badge IDs
        const user = await User.findById(req.params.id);
        const Notification = require('../models/Notification');
        const bcrypt = require('bcryptjs');

        if (!user) return res.status(404).json({ message: 'User not found' });

        let changes = [];

        if (points !== undefined && points !== user.points) {
            const diff = points - user.points;
            user.points = points;
            changes.push(diff > 0 ? `gained ${diff} points` : `lost ${Math.abs(diff)} points`);
        }

        if (streak !== undefined && streak !== user.streak) {
            user.streak = streak;
            changes.push(`streak updated to ${streak}`);
        }

        // Only Owner can update sensitive info (email, password, profilePicture, name)
        if (req.user.role === 'owner') {
            if (email && email !== user.email) {
                user.email = email;
                changes.push('email address updated');
            }

            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                changes.push('password updated');
            }

            if (profilePicture !== undefined && profilePicture !== user.profilePicture) {
                user.profilePicture = profilePicture;
                changes.push('profile picture updated');
            }
        }

        if (badges) {
            const newBadges = badges.map(badgeId => {
                const existing = user.badges.find(b => b.badge.toString() === badgeId);
                return {
                    badge: badgeId,
                    earnedAt: existing ? existing.earnedAt : Date.now()
                };
            });

            // Check for new badges
            const oldBadgeIds = user.badges.map(b => b.badge.toString());
            const addedBadges = badges.filter(id => !oldBadgeIds.includes(id));

            if (addedBadges.length > 0) {
                changes.push(`earned ${addedBadges.length} new badge(s)`);
            }

            user.badges = newBadges;
        }

        if (req.body.solvedChallenges) {
            // solvedChallenges is array of challenge IDs
            const newSolved = req.body.solvedChallenges.map(challengeId => {
                const existing = user.solvedChallenges.find(sc => sc.challenge.toString() === challengeId);
                return {
                    challenge: challengeId,
                    solvedAt: existing ? existing.solvedAt : Date.now()
                };
            });

            // Check for new solved challenges
            const oldSolvedIds = user.solvedChallenges.map(sc => sc.challenge.toString());
            const addedSolved = req.body.solvedChallenges.filter(id => !oldSolvedIds.includes(id));

            if (addedSolved.length > 0) {
                changes.push(`marked ${addedSolved.length} new challenge(s) as solved`);
            }

            user.solvedChallenges = newSolved;
        }

        await user.save();

        // Create notification if there were changes
        if (changes.length > 0) {
            const message = `Admin update: You have ${changes.join(', ')}.`;
            await new Notification({
                user: user._id,
                message: message,
                type: 'info'
            }).save();
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/badges
// @desc    Get all available badges
// @access  Private/Admin
router.get('/badges', auth, adminCheck, async (req, res) => {
    try {
        const badges = await Badge.find();
        res.json(badges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route   DELETE api/admin/user/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/user/:id', auth, ownerCheck, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
