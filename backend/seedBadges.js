const mongoose = require('mongoose');
const Badge = require('./models/Badge');
require('dotenv').config();

const badges = [
    {
        name: 'First Blood',
        description: 'First to solve a challenge',
        icon: '🎯',
        rarity: 'rare',
        type: 'achievement',
        criteria: 'Be the first person to submit a correct solution to a challenge.'
    },
    {
        name: 'Speed Demon',
        description: 'Solve a challenge in under 10 minutes',
        icon: '⚡',
        rarity: 'epic',
        type: 'achievement',
        criteria: 'Submit a correct solution within 10 minutes of starting.'
    },
    {
        name: 'Perfect Score',
        description: 'Get 100% on a challenge',
        icon: '💯',
        rarity: 'uncommon',
        type: 'achievement',
        criteria: 'Pass all test cases for a challenge.'
    },
    {
        name: 'On Fire',
        description: '5 week participation streak',
        icon: '🔥',
        rarity: 'rare',
        type: 'streak',
        criteria: 'Participate in challenges for 5 consecutive weeks.'
    },
    {
        name: 'Streak Master',
        description: '10 week participation streak',
        icon: '🌟',
        rarity: 'epic',
        type: 'streak',
        criteria: 'Participate in challenges for 10 consecutive weeks.'
    },
    {
        name: 'Streak Legend',
        description: '20 week participation streak',
        icon: '💎',
        rarity: 'legendary',
        type: 'streak',
        criteria: 'Participate in challenges for 20 consecutive weeks.'
    },
    {
        name: 'Bronze Champion',
        description: 'Finish in Top 3',
        icon: '🥉',
        rarity: 'rare',
        type: 'rank',
        criteria: 'Finish in the top 3 of the weekly leaderboard.'
    },
    {
        name: 'Silver Star',
        description: 'Finish in Top 2',
        icon: '🥈',
        rarity: 'epic',
        type: 'rank',
        criteria: 'Finish in the top 2 of the weekly leaderboard.'
    },
    {
        name: 'Gold Champion',
        description: 'Finish in Top 1',
        icon: '🥇',
        rarity: 'legendary',
        type: 'rank',
        criteria: 'Finish first in the weekly leaderboard.'
    },
    {
        name: 'Community Helper',
        description: 'Help 10 students in discussions',
        icon: '💬',
        rarity: 'uncommon',
        type: 'community',
        criteria: 'Receive 10 upvotes on discussion comments.'
    },
    {
        name: 'Mentor',
        description: 'Help 50 students in discussions',
        icon: '🎓',
        rarity: 'epic',
        type: 'community',
        criteria: 'Receive 50 upvotes on discussion comments.'
    },
    {
        name: 'Early Adopter',
        description: 'Joined during beta',
        icon: '🚀',
        rarity: 'special',
        type: 'special',
        criteria: 'Join the platform during the beta phase.'
    },
    {
        name: 'Bug Hunter',
        description: 'Report a valid bug',
        icon: '🐛',
        rarity: 'special',
        type: 'special',
        criteria: 'Report a confirmed bug to the admin team.'
    }
];

const seedBadges = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing badges to avoid duplicates/conflicts or just upsert
        // For now, let's clear and re-seed to ensure exact match with requirements
        await Badge.deleteMany({});
        console.log('Cleared existing badges');

        await Badge.insertMany(badges);
        console.log('Badges seeded successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding badges:', error);
        process.exit(1);
    }
};

seedBadges();
