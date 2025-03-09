const express = require('express');

const {
    postUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controller/userController');

const router = express.Router();

// Create User
router.post('/users', postUser);
// Get All Users
router.get('/users', getUsers);
// Get User by ID
router.get('/users/:id', getUserById);
// Update User
router.put('/users/:id', updateUser);
// Delete User
router.delete('/users/:id', deleteUser);

module.exports = router;