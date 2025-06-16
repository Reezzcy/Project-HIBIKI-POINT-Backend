const { User } = require('../models');
const { publishEvent } = require('../publisher');
// const redis = require('../config/redis'); // Jika Anda ingin tetap pakai redis, pindahkan juga konfigurasinya

// Catatan: Fungsi cache sengaja saya hilangkan untuk simplifikasi langkah awal.
// Anda bisa menambahkannya kembali nanti.

const getUsersFromDb = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message,
        });
    }
};

const getUserByIdFromDb = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user',
            error: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.update(req.body);

        const logPayload = {
            user_id: user.id,
            activity_type: 'USER_UPDATED',
            activity_description: `User with ID ${id} updated`,
        };
        publishEvent(logPayload);

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user',
            error: error.message,
        });
    }
};

const deleteUserFromDb = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.destroy();

        const logPayload = {
            user_id: user.id,
            activity_type: 'USER_DELETED',
            activity_description: `User with ID ${id} deleted`,
        };
        publishEvent(logPayload);

        res.status(200).json({
            message: `User with ID ${id} deleted successfully`,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message,
        });
    }
};

module.exports = {
    getUsersFromDb,
    getUserByIdFromDb,
    updateUser,
    deleteUserFromDb,
};
