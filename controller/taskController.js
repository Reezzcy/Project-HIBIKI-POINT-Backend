const { Campaign, Task, User } = require('../database/models');

const postTask = async (req, res) => {
    try {
        const { campaign_id, title, description, assigned_to, priority, status, due_date } = req.body;

        if (!campaign_id || !title || !description || !assigned_to || !priority || !status || !due_date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTask = await Task.create({
            campaign_id, title, description, assigned_to, priority, status, due_date
        });

        await redis.del('all_tasks');
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTasksFromCache = async (req, res) => {
    try {
        const cachedTasks = await redis.get('all_tasks');

        if (cachedTasks) {
            return res.status(200).json(JSON.parse(cachedTasks));
        }

        return res.status(404).json({ message: 'Tasks not found in cache' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTasksFromDb = async (req, res) => {
    try {
        const tasks = await Task.findAll();

        await redis.set('all_tasks', JSON.stringify(tasks), 'EX', 3600);

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaskByIdFromCache = async (req, res) => {
    try {
        const { id } = req.params;
        const cachedTask = await redis.get(`task_${id}`);

        if (cachedTask) {
            return res.status(200).json(JSON.parse(cachedTask));
        }

        return res.status(404).json({ message: `Task with ID ${id} not found in cache` });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaskByIdFromDb = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({where: { task_id: id }});

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await redis.set(`task_${id}`, JSON.stringify(task), 'EX', 3600);

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTasksWithUserFromCache = async (req, res) => {
    try {
        const cachedTasks = await redis.get('all_tasks_with_user');

        if (cachedTasks) {
            return res.status(200).json(JSON.parse(cachedTasks));
        }

        return res.status(404).json({ message: 'Tasks with user not found in cache' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTasksWithUserFromDb = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: [
                {
                    model: Campaign,
                    attributes: ['campaign_id', 'title']
                },
                {
                    model: User,
                    through: { attributes: [] },
                    attributes: ['user_id', 'name']
                }
            ]
        });

        await redis.set('all_tasks_with_user', JSON.stringify(tasks), 'EX', 3600);

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaskByIdWithUserFromCache = async (req, res) => {
    try {
        const { id } = req.params;
        const cachedTask = await redis.get(`task_with_user_${id}`);

        if (cachedTask) {
            return res.status(200).json(JSON.parse(cachedTask));
        }

        return res.status(404).json({ message: `Task with user ID ${id} not found in cache` });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaskByIdWithUserFromDb = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({
            where: { task_id: id },
            include: [
                {
                    model: Campaign,
                    attributes: ['campaign_id', 'title']
                },
                {
                    model: User,
                    through: { attributes: [] },
                    attributes: ['user_id', 'name']
                }
            ]
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await redis.set(`task_with_user_${id}`, JSON.stringify(task), 'EX', 3600);

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add User to Task
const addUserToTask = async (req, res) => {
    try {
        const { user_id, task_id } = req.body;

        const user = await User.findByPk(user_id);
        const task = await Task.findByPk(task_id);

        if (!user || !task) {
            return res.status(404).json({ message: "User or Task not found!" });
        }

        await user.addTask(task);

        await redis.del(`task_${task_id}`);
        await redis.del('all_tasks');
        return res.status(200).json({ message: "User added to Task successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding user to Task", error: error.message });
    }
};

// Remove User from Task
const removeUserFromTask = async (req, res) => {
    try {
        const { user_id, task_id } = req.body;

        const user = await User.findByPk(user_id);
        const task = await Task.findByPk(task_id);

        if (!user || !task) {
            return res.status(404).json({ message: "User or Task not found!" });
        }

        await user.removeTask(task);

        await redis.del(`task_${task_id}`);
        await redis.del('all_tasks');
        return res.status(200).json({ message: "User removed from Task successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error removing user from Task", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, assigned_to, priority, status, due_date } = req.body;
        const task = await Task.findByPk(id);
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.update({ title, description, assigned_to, priority, status, due_date });
        await redis.del(`task_${id}`);
        await redis.del('all_tasks');
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAllTasksFromCache = async (req, res) => {
    try {
        await redis.del('all_tasks');
        return res.status(200).json({ message: 'All tasks cache deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all tasks from cache', error: error.message });
    }
};

const deleteTaskFromCache = async (req, res) => {
    try {
        const { id } = req.params;
        await redis.del(`task_${id}`);
        return res.status(200).json({ message: `Task cache for ID ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAllTasksWithUserFromCache = async (req, res) => {
    try {
        await redis.del('all_tasks_with_user');
        return res.status(200).json({ message: 'All tasks with user cache deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all tasks with user from cache', error: error.message });
    }
};

const deleteTaskWithUserFromCache = async (req, res) => {
    try {
        const { id } = req.params;
        await redis.del(`task_with_user_${id}`);
        return res.status(200).json({ message: `Task with user cache for ID ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTaskFromDb = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.destroy();
        await redis.del(`task_${id}`);
        await redis.del('all_tasks');
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    postTask,
    getAllTasksFromCache,
    getAllTasksFromDb,
    getTaskByIdFromCache,
    getTaskByIdFromDb,
    getAllTasksWithUserFromCache,
    getAllTasksWithUserFromDb,
    getTaskByIdWithUserFromCache,
    getTaskByIdWithUserFromDb,
    addUserToTask,
    removeUserFromTask,
    updateTask,
    deleteAllTasksFromCache,
    deleteTaskFromCache,
    deleteAllTasksWithUserFromCache,
    deleteTaskWithUserFromCache,
    deleteTaskFromDb,
};
