const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Announcement = require('../models/Announcement');

// Middleware to check if owner
const ownerCheck = (req, res, next) => {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ message: 'Access denied. Owner only.' });
    }
    next();
};

// @route   GET api/announcements
// @desc    Get all announcements
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(announcements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/announcements
// @desc    Create an announcement
// @access  Private/Owner
router.post('/', auth, ownerCheck, async (req, res) => {
    try {
        const { title, message } = req.body;

        const newAnnouncement = new Announcement({
            title,
            message,
            author: req.user.id
        });

        const announcement = await newAnnouncement.save();
        res.json(announcement);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/announcements/:id
// @desc    Delete an announcement
// @access  Private/Owner
router.delete('/:id', auth, ownerCheck, async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Announcement removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
