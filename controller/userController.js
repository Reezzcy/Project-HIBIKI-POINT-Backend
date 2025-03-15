const { User } = require('../models');

// Create User
const postUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Users
const getUsers = async (req, res) => {
    const users = await User.findAll();
    res.json(users);
};

// Get User by ID
const getUserById = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    user ? res.json(user) : res.status(404).json({ message: 'User not found' });
};

// Update User
const updateUser = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update(req.body);
    res.json(user);
};

// Delete User
const deleteUser = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted' });
};

module.exports = {
    postUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
