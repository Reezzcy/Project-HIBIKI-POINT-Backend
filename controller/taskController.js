const Task = require('../models/task');
const Campaign = require('../models/campaign');

// Create Task
postTask = async (req, res) => {
    try {
        const { campaign_id, title, description, assigned_to, priority, status, due_date } = req.body;

        const newTask = await Task.create({
            campaign_id,
            title,
            description,
            assigned_to,
            priority,
            status,
            due_date
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Tasks
getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: {
                model: Campaign,
                attributes: ['campaign_id', 'title']
            }
        });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Task by ID
getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({
            where: { task_id: id },
            include: {
                model: Campaign,
                attributes: ['campaign_id', 'title']
            }
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Task
updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, assigned_to, priority, status, due_date } = req.body;

        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.update({ title, description, assigned_to, priority, status, due_date });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Task
deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.destroy();

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    postTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};
