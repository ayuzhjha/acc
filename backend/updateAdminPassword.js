const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const updateAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const adminEmail = 'admin@stu.xim.edu.in';
        const user = await User.findOne({ email: adminEmail });

        if (!user) {
            console.log('Admin user not found');
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Lun@r3clipse', salt);

        user.password = hashedPassword;
        await user.save();

        console.log('Admin password updated successfully to: Lun@r3clipse');
        process.exit();
    } catch (error) {
        console.error('Error updating admin password:', error);
        process.exit(1);
    }
};

updateAdminPassword();
