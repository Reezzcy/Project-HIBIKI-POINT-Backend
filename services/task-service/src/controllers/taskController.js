const { Task, UserTask, Campaign } = require('../models');
const { publishEvent } = require('../publisher');

// Membuat task baru
const postTask = async (req, res) => {
    try {
        const creatorId = req.user.id;
        const {
            campaign_id,
            title,
            description,
            assigned_to,
            priority,
            status,
            due_date,
        } = req.body;

        const newTask = await Task.create({
            campaign_id,
            title,
            description,
            assigned_to,
            priority,
            status,
            due_date,
        });

        // Terbitkan Event untuk notifikasi dan logging
        publishEvent('task.created', {
            taskId: newTask.task_id,
            title: newTask.title,
            assigneeId: assigned_to,
            creatorId: creatorId,
            dueDate: due_date,
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan semua task (bisa di-filter by campaign_id, dll)
const getAllTasks = async (req, res) => {
    try {
        // Tambahkan filter jika ada query params
        const whereClause = {};
        if (req.query.campaign_id) {
            whereClause.campaign_id = req.query.campaign_id;
        }
        if (req.query.status) {
            whereClause.status = req.query.status;
        }

        const tasks = await Task.findAll({ where: whereClause });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan task by ID
const getTaskById = async (req, res) => {
    try {
        const { task_id } = req.params;
        const task = await Task.findByPk(task_id, {
            // Kita bisa join ke Campaign karena berada di service yang sama
            include: [{ model: Campaign, attributes: ['title'] }],
        });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Task (contoh spesifik untuk status)
const updateTask = async (req, res) => {
    try {
        const { task_id } = req.params;
        const updaterId = req.user.id;

        const task = await Task.findByPk(task_id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const oldStatus = task.status;
        const newStatus = req.body.status;

        await task.update(req.body);

        // Jika status berubah, terbitkan event
        if (newStatus && oldStatus !== newStatus) {
            publishEvent('task.status.changed', {
                taskId: task.task_id,
                title: task.title,
                oldStatus: oldStatus,
                newStatus: newStatus,
                updatedBy: updaterId,
                assigneeId: task.assigned_to,
            });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const { task_id } = req.params;
        const deleterId = req.user.id;

        const task = await Task.findByPk(task_id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        publishEvent('task.deleted', {
            taskId: id,
            title: task.title,
            deletedBy: deleterId,
        });

        await task.destroy();
        
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan semua task berdasarkan campaign_id
const getTasksByCampaignId = async (req, res) => {
    try {
        const { campaign_id } = req.params;
        const tasks = await Task.findAll({
            where: { campaign_id },
            include: [{ model: Campaign, attributes: ['title'] }],
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan semua task yang ditugaskan kepada user tertentu
const getTasksByAssignee = async (req, res) => {
    try {
        const { user_id } = req.params;
        const tasks = await Task.findAll({
            where: { assigned_to: user_id },
            include: [{ model: Campaign, attributes: ['title'] }],
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan semua task yang dibuat oleh user tertentu
const getTasksByCreator = async (req, res) => {
    try {
        const { creator_id } = req.params;
        const tasks = await Task.findAll({
            where: { created_by: creator_id },
            include: [{ model: Campaign, attributes: ['title'] }],
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan semua task yang memiliki status tertentu
const getTasksByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const tasks = await Task.findAll({
            where: { status },
            include: [{ model: Campaign, attributes: ['title'] }],
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    postTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByCampaignId,
    getTasksByAssignee,
    getTasksByCreator,
    getTasksByStatus,
};
