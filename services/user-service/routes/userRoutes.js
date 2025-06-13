const express = require('express');

const {
    getUsersFromDb,
    getUserByIdFromDb,
    updateUser,
    deleteUserFromDb,
    getUserAttachments,
    getUserComments,
    getUserNotifications,
    getUserTasks,
    getUserReminders
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
// Get User with Attachments
router.get('/users/attachments/:id', getUserAttachments);
// Get User with Comments
router.get('/users/comments/:id', getUserComments);
// Get User with Notifications
router.get('/users/notifications/:id', getUserNotifications);
// Get User with Tasks
router.get('/users/tasks/:id', getUserTasks);
// Get User with Reminders
router.get('/users/reminders/:id', getUserReminders);

module.exports = router;
