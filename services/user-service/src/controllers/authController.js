const { Auth, User } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { publishEvent } = require('../publisher');

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

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name: name, status: 'Active' });
        const newAuth = await Auth.create({
            email,
            password: hashedPassword,
            user_id: newUser.user_id,
        });

        // const logPayload = {
        //     user_id: newUser.user_id,
        //     activity_type: 'register',
        //     activity_description: `User registered with email: ${email}`,
        // };
        // publishEvent(logPayload);

        // 1. Publish Logging Event
        const logEventPayload = {
            routingKey: 'log.user.register',
            eventData: {
                user_id: newUser.user_id,
                activity_type: 'user_register',
                activity_description: `User "${name}" (${email}) registered successfully.`,
                timestamp: new Date().toISOString(),
            },
        };
        await publishEvent(
            logEventPayload.routingKey,
            logEventPayload.eventData
        );

        // 2. Publish Notification Event (for welcome email)
        const notificationEventPayload = {
            routingKey: 'user.registered',
            eventData: {
                user_id: newUser.user_id,
                user_email: email,
                user_name: name,
                notification_type: 'welcome_email',
                message_subject: 'Welcome to Hibiki Point!',
                message_body: `Dear ${name},\n\nWelcome to Hibiki Point! We're excited to have you join our community.\n\nBest regards,\nThe Hibiki Point Team`,
            },
        };
        await publishEvent(
            notificationEventPayload.routingKey,
            notificationEventPayload.eventData
        );

        res.status(201).json({
            status: 'Success',
            message: 'User created successfully',
            data: {
                newUser,
                id: newAuth.auth_id,
                email: newAuth.email,
                user_id: newAuth.user_id,
            },
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

        // const logPayload = {
        //     user_id: auth.user_id,
        //     activity_type: 'login',
        //     activity_description: `User logged in with email: ${auth.email}`,
        // };
        // publishEvent(logPayload);

        // 1. Publish Logging Event
        const logEventPayload = {
            routingKey: 'log.user.login', // Gunakan routing key yang deskriptif
            eventData: {
                user_id: auth.user_id,
                activity_type: 'user_login',
                activity_description: `User "${auth.User.name}" (${auth.email}) logged in.`,
                timestamp: new Date().toISOString(),
            },
        };
        publishEvent(logEventPayload.routingKey, logEventPayload.eventData);

        // 2. Publish Notification Event (jika perlu)
        const notificationEventPayload = {
            routingKey: 'user.loggedIn',
            eventData: {
                user_id: auth.user_id,
                user_email: auth.email,
                user_name: auth.User.name,
                notification_type: 'security_alert',
                // ... informasi lain yang relevan
            },
        };
        publishEvent(
            notificationEventPayload.routingKey,
            notificationEventPayload.eventData
        );

        res.status(200).json({
            status: 'Success',
            message: 'User logged in successfully',
            data: {
                id: auth.auth_id,
                email: auth.email,
                user_id: auth.user_id,
                generateToken,
            },
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

const verifierClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
    try {
        const { id_token } = req.body;
        if (!id_token) {
            return res
                .status(400)
                .json({ message: 'ID Token tidak ditemukan.' });
        }

        const ticket = await verifierClient.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name } = ticket.getPayload();

        let auth = await Auth.findOne({
            where: { email },
            include: [
                {
                    model: User,
                    as: 'User',
                },
            ],
        });

        if (!auth) {
            const newUser = await User.create({
                name: name,
                status: 'Active',
            });

            const newAuth = await Auth.create({
                email: email,
                password: null,
                user_id: newUser.user_id,
            });

            auth = await Auth.findOne({
                where: { auth_id: newAuth.auth_id },
                include: [
                    {
                        model: User,
                        as: 'User',
                    },
                ],
            });
        }

        const payload = {
            id: auth.user_id,
            email: auth.email,
            name: auth.User.name,
        };

        const appToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRED || '1d',
        });

        res.status(200).json({
            status: 'Success',
            message: 'Login dengan Google berhasil.',
            data: {
                token: appToken,
                user: payload,
            },
        });
    } catch (error) {
        console.error('Error pada Google login:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Otentikasi gagal.',
            error: error.message,
        });
    }
};

// Google Callback to access any of their Google services (like their calendar, contacts, drive, etc.)
const oauth2Client = require('../config/googleAuth');

const googleCallback = async (req, res, next) => {
    try {
        // Dapatkan 'code' yang diberikan Google setelah redirect
        const { code } = req.query;

        // Tukarkan 'code' dengan tokens (access_token dan refresh_token)
        const { tokens } = await oauth2Client.getToken(code);

        // Simpan tokens.access_token dan tokens.refresh_token ini ke database
        // yang terhubung dengan user. INI SANGAT PENTING!
        // Contoh: await User.update({
        //    google_access_token: tokens.access_token,
        //    google_refresh_token: tokens.refresh_token
        // }, { where: { email: user_email } });

        // Sekarang, Anda bisa mengarahkan user kembali ke frontend Anda
        res.redirect('http://localhost:5173/dashboard');
    } catch (error) {
        console.error('Google callback error:', error);
        res.status(500).json({
            message: 'Callback failed',
            error: error.message,
        });
    }
};

module.exports = {
    register,
    login,
    tokenChecker,
    googleLogin,
    googleCallback,
};
