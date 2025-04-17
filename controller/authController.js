const { Auth, User } = require('../database/models');
const { sendNotificationEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({
                status: 'Error',
                message: 'Username and password are required',
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

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

        const newUser = await User.create({
            name: name,
            status: 'Active',
        });

        const newAuth = await Auth.create({
            email,
            password: hashedPassword,
            user_id: newUser.user_id,
        });

        const recipientEmail = email; // Gunakan email yang didaftarkan
        const subject = 'Selamat Datang di Aplikasi Kami!';
        const text = `Terima kasih telah mendaftar dengan nama ${name}!`;

        sendNotificationEmail(recipientEmail, subject, text);

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

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'Error',
                message: 'Email and password are required',
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        const auth = await Auth.findOne({
            where: { email },
            include: { model: User, as: 'User', attributes: ['name'] },
        });

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

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'Error',
                message: 'Invalid email or password',
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

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

        const recipientEmail = auth.email;
        const subject = 'Aktivitas Login Baru di Akun Anda';
        const text = `Akun Anda dengan email ${auth.email} baru saja digunakan untuk login.`;

        sendNotificationEmail(recipientEmail, subject, text);

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

const tokenChecker = (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                status: 'Error',
                message: 'User not found',
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

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
