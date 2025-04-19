const express = require('express');

const {
    getUsersFromDb,
    getUserByIdFromDb,
    updateUser,
    deleteUserFromDb,
} = require('../controller/userController');

const router = express.Router();

// Get All Users from DB
router.get('/users', getUsersFromDb);
// Get User by ID from DB
router.get('/users/:id', getUserByIdFromDb);
// Update User
router.put('/users/:id', updateUser);
// Delete User from DB
router.delete('/users/:id', deleteUserFromDb);

module.exports = router;
