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
        if (typeof publishEvent === 'function') {
            publishEvent('task.created', {
                taskId: newTask.task_id,
                title: newTask.title,
                assigneeId: assigned_to,
                creatorId: creatorId,
                dueDate: due_date,
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        res.status(201).json({
            status: 'success',
            message: 'Task created successfully.',
            data: newTask,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to create task.',
            data: { details: error.message },
        });
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
        res.status(200).json({
            status: 'success',
            message: 'All tasks retrieved successfully.',
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve tasks.',
            data: { details: error.message },
        });
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
        if (!task) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found.',
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Task retrieved successfully.',
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve task.',
            data: { details: error.message },
        });
    }
};

// Update Task (contoh spesifik untuk status)
const updateTask = async (req, res) => {
    try {
        const { task_id } = req.params;
        const updaterId = req.user.id;

        const task = await Task.findByPk(task_id);
        if (!task) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found.',
                data: null,
            });
        }

        const oldStatus = task.status;
        const newStatus = req.body.status;

        await task.update(req.body);

        // Jika status berubah, terbitkan event
        if (newStatus && oldStatus !== newStatus) {
            if (typeof publishEvent === 'function') {
                publishEvent('task.status.changed', {
                    taskId: task.task_id,
                    title: task.title,
                    oldStatus: oldStatus,
                    newStatus: newStatus,
                    updatedBy: updaterId,
                    assigneeId: task.assigned_to,
                });
            } else {
                console.warn('publishEvent function is not defined.');
            }
        }

        res.status(200).json({
            status: 'success',
            message: 'Task updated successfully.',
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to update task.',
            data: { details: error.message },
        });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const { task_id } = req.params;
        const deleterId = req.user.id;

        const task = await Task.findByPk(task_id);
        if (!task) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found.',
                data: null,
            });
        }

        // Corrected variable name from 'id' to 'task_id' for publishEvent
        if (typeof publishEvent === 'function') {
            publishEvent('task.deleted', {
                taskId: task_id,
                title: task.title,
                deletedBy: deleterId,
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        await task.destroy();

        res.status(200).json({
            status: 'success',
            message: 'Task deleted successfully.',
            data: null, // No specific data to return on delete success
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete task.',
            data: { details: error.message },
        });
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

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: `No tasks found for campaign ID ${campaign_id}.`,
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Tasks for campaign ID ${campaign_id} retrieved successfully.`,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve tasks by campaign ID.',
            data: { details: error.message },
        });
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

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: `No tasks found for assignee ID ${user_id}.`,
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Tasks assigned to user ID ${user_id} retrieved successfully.`,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve tasks by assignee.',
            data: { details: error.message },
        });
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

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: `No tasks found for creator ID ${creator_id}.`,
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Tasks created by user ID ${creator_id} retrieved successfully.`,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve tasks by creator.',
            data: { details: error.message },
        });
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

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: `No tasks found with status '${status}'.`,
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Tasks with status '${status}' retrieved successfully.`,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve tasks by status.',
            data: { details: error.message },
        });
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
