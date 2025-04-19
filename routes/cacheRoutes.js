const express = require('express');
const router = express.Router();

const {
    getUsersFromCache,
    getUserByIdFromCache,
    deleteUserFromCache,
    deleteAllUsersCache
} = require('../controller/userController');

const { 
    getAllCampaignsFromCache,
    getCampaignByIdFromCache,
    deleteCampaignFromCache,
    deleteAllCampaignsFromCache,
} = require('../controller/campaignController');

const { 
    getAllTasksFromCache,
    getTaskByIdFromCache,
    deleteTaskFromCache,
    deleteAllTasksFromCache,
} = require('../controller/taskController');

// Get All Users from Cache
router.get('/users', getUsersFromCache);
// Get User by ID from Cache
router.get('/users/:id', getUserByIdFromCache);
// Delete All Users from Cache
router.delete('/users', deleteAllUsersCache);
// Delete User from Cache
router.delete('/users/:id', deleteUserFromCache);
// Get All Campaigns from Cache
router.get('/campaigns', getAllCampaignsFromCache);
// Get Campaign by ID from Cache
router.get('/campaigns/:id', getCampaignByIdFromCache);
// Delete All Campaigns from Cache
router.delete('/campaigns', deleteAllCampaignsFromCache);
// Delete Campaign from Cache
router.delete('/campaigns/:id', deleteCampaignFromCache);
// Get All Tasks from Cache
router.get('/tasks', getAllTasksFromCache);
// Get Task by ID from Cache
router.get('/tasks/:id', getTaskByIdFromCache);
// Delete All Tasks from Cache
router.delete('/tasks', deleteAllTasksFromCache);
// Delete Task from Cache
router.delete('/tasks/:id', deleteTaskFromCache);

module.exports = router;
