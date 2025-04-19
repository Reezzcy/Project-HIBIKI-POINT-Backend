const { Auth, User } = require('../database/models');
const { sendNotificationEmail } = require('../service/emailService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// This function handles user registration
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if the required fields are provided
        if (!name || !password) {
            return res.status(400).json({
                status: 'Error',
                message: 'Username and password are required',
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        // Check if the email is provided and valid
        const user = await Auth.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({
                status: 'Error',
                message: 'User already exists',
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the User table
        const newUser = await User.create({
            name: name,
            status: 'Active',
        });

        // Create a new auth record in the Auth table
        const newAuth = await Auth.create({
            email,
            password: hashedPassword,
            user_id: newUser.user_id,
        });

        // Generate a JWT token for the user
        const recipientEmail = email; // Gunakan email yang didaftarkan
        const subject = 'Selamat Datang di Aplikasi Kami!';
        const text = `Terima kasih telah mendaftar dengan nama ${name}!`;

        // Send a welcome email to the user
        sendNotificationEmail(recipientEmail, subject, text);

        // Send a notification email to the admin
        return res.status(201).json({
            status: 'Success',
            message: 'User created successfully',
            data: {
                newUser,
                id: newAuth.auth_id,
                email: newAuth.email,
                user_id: newAuth.user_id,
            },
            isError: false,
            isSuccess: true,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// This function handles user login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if the required fields are provided
        if (!email || !password) {
            return res.status(400).json({
                status: 'Error',
                message: 'Email and password are required',
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        // Check if the user exists in the Auth table
        const auth = await Auth.findOne({
            where: { email },
            include: { model: User, as: 'User', attributes: ['name'] },
        });

        // If the user does not exist, return an error response
        if (!auth) {
            return res.status(404).json({
                status: 'Error',
                message: 'User not found',
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, auth.password);

        // If the password is incorrect, return an error response
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'Error',
                message: 'Invalid email or password',
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        // If the password is correct, generate a JWT token
        const generateToken = jwt.sign(
            {
                id: auth.user_id,
                email: auth.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRED,
            }
        );

        // Update the auth record with the new token
        const recipientEmail = auth.email;
        const subject = 'Aktivitas Login Baru di Akun Anda';
        const text = `Akun Anda dengan email ${auth.email} baru saja digunakan untuk login.`;

        // Send a notification email to the user
        sendNotificationEmail(recipientEmail, subject, text);

        // Send a notification email to the admin
        return res.status(200).json({
            status: 'Success',
            message: 'User logged in successfully',
            data: {
                id: auth.auth_id,
                email: auth.email,
                user_id: auth.user_id,
                generateToken,
            },
            isError: false,
            isSuccess: true,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// This function checks if the token is valid and returns the user information
const tokenChecker = (req, res, next) => {
    try {
        const user = req.user;

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                status: 'Error',
                message: 'User not found',
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        // If the user exists, return the user information
        return res.status(200).json({
            status: 'Success',
            message: 'Token verified successfully',
            data: user,
            isError: false,
            isSuccess: true,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    tokenChecker,
};
