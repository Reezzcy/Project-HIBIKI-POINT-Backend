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
router.post('/Tasks', postTask);
// Get All Tasks
router.get('/Tasks', getAllTasks);
// Get Task by ID
router.get('/Tasks/:id', getTaskById);
// Update Task
router.put('/Tasks/:id', updateTask);
// Delete Task
router.delete('/Tasks/:id', deleteTask);

module.exports = router;