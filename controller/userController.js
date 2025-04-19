const { User, Task, Notification, Reminder, Attachment, Comment } = require('../database/models');

// Function to get all users from cache
const getUsersFromCache = async (req, res) => {
    try {
        const cachedUsers = await redis.get('all_users');

        if (cachedUsers) {
            return res.status(200).json(JSON.parse(cachedUsers));
        }

        return res.status(200).json({ message: 'Cache miss for users', users: [] });
    } catch (error) {
        res.status(500).json({ message: `Error fetching from cache for users: ${error.message}`, error: error.message });
    }
};

// Function to get all users from DB and cache them
const getUsersFromDb = async (req, res) => {
    try {
        const users = await User.findAll();

        if (users) {
            await redis.set('all_users', JSON.stringify(users), 'EX', 3600);

            if (users.length === 0) {
                return res.status(200).json([]);  // Return empty array if no users
            }

            return res.status(200).json(users);
        }

        return res.status(404).json({ message: 'Users not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching from DB', error: error.message });
    }
};

// Function to get user by ID from cache
const getUserByIdFromCache = async (req, res) => {
    try {
        const { id } = req.params;
        const cachedUser = await redis.get(`user_${id}`);

        if (cachedUser) {
            return res.status(200).json(JSON.parse(cachedUser));
        }

        return res.status(404).json({ message: `User with ID ${id} not found in cache` });
    } catch (error) {
        res.status(500).json({ message: `Error fetching user with ID ${id} from cache: ${error.message}`, error: error.message });
    }
};

// Function to get user by ID from DB and cache it
const getUserByIdFromDb = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await redis.set(`user_${id}`, JSON.stringify(user), 'EX', 3600);
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `Error fetching user with ID ${id} from DB: ${error.message}`, error: error.message });
    }
};

// Function to update user and invalidate the cache
const updateUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update(req.body);

        await redis.del(`user_${id}`);
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Function to delete user cache by ID
const deleteUserFromCache = async (req, res) => {
    try {
        const { id } = req.params;

        await redis.del(`user_${id}`);
        return res.status(200).json({ message: `User cache for ID ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting from cache', error: error.message });
    }
};

// Function to delete all users cache
const deleteAllUsersCache = async (req, res) => {
    try {
        await redis.del('all_users');
        return res.status(200).json({ message: 'All users cache deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all users from cache', error: error.message });
    }
};

// Function to delete user from DB and invalidate the cache
const deleteUserFromDb = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();

        await redis.del(`user_${id}`);
        return res.status(200).json({ message: `User with ID ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: `Error deleting user with ID ${id} from DB: ${error.message}`, error: error.message });
    }
};

// Function Get User with Tasks
const getUserTasks = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: {
                model: Task,
                through: { attributes: [] },
            }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ tasks: user.Tasks });
    } catch (error) {
        res.status(500).json({ message: `Error fetching tasks for user ${id}`, error: error.message });
    }
};

// Function Get User with Notifications
const getUserNotifications = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: Notification
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ notifications: user.Notifications });
    } catch (error) {
        res.status(500).json({ message: `Error fetching notifications for user ${id}`, error: error.message });
    }
};

// Function Get User with Reminders
const getUserReminders = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: Reminder
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ reminders: user.Reminders });
    } catch (error) {
        res.status(500).json({ message: `Error fetching reminders for user ${id}`, error: error.message });
    }
};

// Function Get User with Comments
const getUserComments = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: Comment
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ comments: user.Comments });
    } catch (error) {
        res.status(500).json({ message: `Error fetching comments for user ${id}`, error: error.message });
    }
};

// Function Get User with Attachments
const getUserAttachments = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: Attachment
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ attachments: user.Attachments });
    } catch (error) {
        res.status(500).json({ message: `Error fetching attachments for user ${id}`, error: error.message });
    }
};

module.exports = {
    getUsersFromCache,
    getUsersFromDb,
    getUserByIdFromCache,
    getUserByIdFromDb,
    updateUser,
    deleteUserFromCache,
    deleteUserFromDb,
    deleteAllUsersCache,
    getUserAttachments,
    getUserComments,
    getUserNotifications,
    getUserTasks,
    getUserReminders
};
