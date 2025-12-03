const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const migrateOwner = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // 1. Find the existing admin (likely named "Owner" or "Admin User")
        // We'll look for the user who currently has role 'admin' and upgrade them to 'owner'
        // If there are multiple, we might need to be specific. For now, let's find by email if known, or just the first admin.
        // The user said they changed the admin's name to "owner".

        // Let's try to find a user with name "Owner" (case insensitive) or just the first admin found.
        let ownerUser = await User.findOne({ name: { $regex: /^owner$/i } });

        if (!ownerUser) {
            console.log('User named "Owner" not found. Looking for any admin...');
            ownerUser = await User.findOne({ role: 'admin' });
        }

        if (ownerUser) {
            console.log(`Found user to upgrade: ${ownerUser.name} (${ownerUser.email})`);
            ownerUser.role = 'owner';
            await ownerUser.save();
            console.log('User upgraded to OWNER role.');
        } else {
            console.log('No existing admin user found to upgrade.');
        }

        // 2. Create the new Admin user
        const newAdminEmail = 'admin@stu.xim.edu.in';
        const newAdminPassword = '0acm#@admin1';

        const existingNewAdmin = await User.findOne({ email: newAdminEmail });
        if (existingNewAdmin) {
            console.log('New admin user already exists.');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newAdminPassword, salt);

            const newAdmin = new User({
                name: 'Admin',
                email: newAdminEmail,
                password: hashedPassword,
                role: 'admin',
                gender: 'Other',
                age: 20,
                isAcmMember: true,
                acmId: 'ADMIN-002'
            });

            await newAdmin.save();
            console.log(`New Admin user created: ${newAdminEmail}`);
        }

        process.exit();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateOwner();
