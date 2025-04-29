const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router =express.Router();

//Register Route
router.post(
    '/register', 
    [
        body('name')
            .notEmpty().withMessage('Name is Required'),
        body('email')
            .isEmail().withMessage('Valid email is required')
            .notEmpty().withMessage('Email is Required'),
        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {name, email, password} = req.body;

        try{
            let user = await User.findOne({email});
            if(user) return res.status(400).json({ message: 'User already exist' })

            user = new User({ name, email, password});
            await user.save();

            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
            
            res.status(201).json({message: 'User registered successfully', token, user:{id: user._id, name, email}});
        }
        catch(err){
            res.status(500).json({message: err.message});
        }
    }
    
)

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid Email is Required'),
        body('password').notEmpty().withMessage('Password is Required'),
    ],

    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({ errors: errors.array() });
        }

        const {email, password} = req.body;

        try{
            let user = await User.findOne({email});
            if(!user) return res.status(400).json({ message: 'Invalid credentials '});

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({ mesage: 'Invalid credentails' })

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '1h'})

            res.json({ message: 'Login successful', token, user:{id:user._id, name:user.name, email:user.email}});
        }
        catch(err) {
            res.status(500).json({ message: err.message});
        }
    }
)

// Setup Nodemailer Transporter - Passwrod rest
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, //Bypass SSL certificate verification **Development Purpose Only
    }
})

// Password Reset Request - Send Email with Token
router.post('/forget-password', async (req, res) => {
    const {email} = req.body;

    try{
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: 'User not found'})

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send Email with reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request - Personal Finance Tracker',
            html: `
                <p>
                You requested a password reset for your Personal Finance Tracker Account.<br />
                Click the link below to reset your password.
                </p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link expires in 1 hour.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({message: 'Password Rest Link sent to your email.'})

    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

// Validate Reset token
router.get('/reset-password/:token', async (req, res) => {
    try{
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: {$gt: Date.now()},
        });

        if(!user) return res.status(400).json({ message: 'Invalid or Expired Token.' });

        res.json({ message: 'Valid Token', email: user.email });
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
})

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;

    try{
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: {$gt: Date.now()},
        });

        if(!user) return res.status(400).json({ message: 'Invalid or Expired Token'});

        user.password = password
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: 'Password has been reset successfully'});
    }
    catch(err){
        res.status(500).json({ message: err.message})
    }
})

module.exports = router;