const { Auth, User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: "Error",
                message: "Username and password are required",
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        const user = await Auth.findOne(email);
        if (user) {
            return res.status(400).json({
                status: "Error",
                message: "User already exists",
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name,
        });

        const newAuth = await Auth.create({
            email,
            password: hashedPassword,
            userId: newUser.id,
        });

        return res.status(201).json({
            status: "Success",
            message: "User created successfully",
            data: {
                newUser,
                id: newAuth.id,
                email: newAuth.email,
                password: newAuth.password,
                userId: newAuth.userId,
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
                status: "Error",
                message: "Email and password are required",
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        const auth = await Auth.findOne(email, {
            include: { model: User, as: "User", attributes: ["name"] }
        });

        if (!auth) {
            return res.status(404).json({
                status: "Error",
                message: "User not found",
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, auth.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "Error",
                message: "Invalid email or password",
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        const generateToken = jwt.sign(
            {
                id: auth.userId,
                email: auth.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRED,
            }
        );

        return res.status(200).json({
            status: "Success",
            message: "User logged in successfully",
            data: {
                id: auth.id,
                email: auth.email,
                userId: auth.userId,
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
                status: "Error",
                message: "User not found",
                data: null,
                isError: true,
                isSuccess: false,
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Token verified successfully",
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