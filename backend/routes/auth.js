const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email Transporter (Configure with Env Vars)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or use host/port
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"ACM Challenge Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code', // Simpler subject
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #000;">Verify your email address</h2>
                <p>Hello,</p>
                <p>Thank you for registering. Please use the following code to complete your verification:</p>
                <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${otp}</span>
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,<br/>ACM Challenge Team</p>
            </div>
        `,
        text: `Your verification code is: ${otp}. It expires in 10 minutes.` // Fallback plain text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw to be caught by register handler
    }
};

// Register
router.post('/register', async (req, res) => {
    let user;
    let otp;
    try {
        const { name, email, password, gender, age, isAcmMember, acmId, collegeName, graduationYear } = req.body;

        // Check if user exists
        user = await User.findOne({ email });
        if (user) {
            // If user exists but not verified, maybe resend OTP?
            // For now, standard "User already exists"
            if (!user.isVerified) {
                // Generate new OTP and resend
                otp = Math.floor(100000 + Math.random() * 900000).toString();
                user.otp = otp;
                user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

                // Update fields if they changed? 
                // Optionally update password/details here if you want to support re-registration of unverified
                user.name = name;
                user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));

                await user.save();
                await sendOTPEmail(email, otp);
                return res.json({ message: 'User already registered but not verified. New OTP sent.', email, needsVerification: true });
            }
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        // Create user
        user = new User({
            name,
            email,
            password: hashedPassword,
            gender,
            age,
            isAcmMember,
            acmId: isAcmMember ? acmId : undefined,
            collegeName,
            graduationYear,
            otp,
            otpExpires,
            isVerified: false
        });

        await user.save();

        // Send OTP
        await sendOTPEmail(email, otp);

        res.json({ message: 'Registration successful. Please verify your email.', email, needsVerification: true });

    } catch (err) {
        console.error("Registration error:", err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        // If email fails, still allow registration for dev/testing
        if (err.code === 'EAUTH' || err.message.includes('Missing credentials')) {
            console.log("Email credentials missing/invalid. OTP was:", otp);
            return res.json({
                message: 'Registration successful but email failed to send.',
                email: req.body.email,
                needsVerification: true,
                emailError: err.message, // Send specific error to frontend
                devOtp: otp
            });
        }

        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user with keeping otp selected (requires separate query or explicit select if validation was off)
        // Since otp is select: false, we need to select it.
        const user = await User.findOne({ email }).select('+otp +otpExpires');

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Verify user
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Create Token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendOTPEmail(email, otp);

        res.json({ message: 'OTP resent successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check verification (DISABLED per user request)
        // if (!user.isVerified) {
        //     return res.status(400).json({ message: 'Please verify your email first', needsVerification: true, email: user.email });
        // }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/auth/profile
// @desc    Update user profile (picture)
// @access  Private
const auth = require('../middleware/auth');
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, gender, profilePicture, collegeName, graduationYear } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (gender) user.gender = gender;
        if (collegeName) user.collegeName = collegeName;
        if (graduationYear) user.graduationYear = graduationYear;
        if (profilePicture !== undefined) {
            user.profilePicture = profilePicture;
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
