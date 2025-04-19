const express = require('express');

const {
    postTask,
    getAllTasksFromDb,
    getTaskByIdFromDb,
    getAllTasksWithUserFromDb,
    getTaskByIdWithUserFromDb,
    addUserToTask,
    removeUserFromTask,
    updateTask,
    deleteTaskFromDb
} = require('../controller/taskController');
const { route } = require('./userRoutes');

const router = express.Router();

// Create Task
router.post('/tasks', postTask);
// Add User to Task 
router.post('/addUser', addUserToTask);
// Get All Tasks from DB
router.get('/tasks', getAllTasksFromDb);
// Get Task by ID from DB
router.get('/tasks/:id', getTaskByIdFromDb);
// Get Task with User from DB
router.get('/tasksWithUser', getAllTasksWithUserFromDb);
// Get Task by ID with User from DB
router.get('/taksWithUser/:id', getTaskByIdWithUserFromDb);
// Update Task
router.put('/tasks/:id', updateTask);
// Delete Task from DB
router.delete('/tasks/:id', deleteTaskFromDb);
// Remove User from Task
router.delete('/removeUser', removeUserFromTask);

module.exports = router;
