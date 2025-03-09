const express = require('express');

const {
    postTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require('../controller/taskController');

const router = express.Router();

// Create Task
router.post('/tasks', postTask);
// Get All Tasks
router.get('/tasks', getAllTasks);
// Get Task by ID
router.get('/tasks/:id', getTaskById);
// Update Task
router.put('/tasks/:id', updateTask);
// Delete Task
router.delete('/tasks/:id', deleteTask);

module.exports = router;
