const express = require('express');

const {
    postCampaign,
    addUserToCampaign,
    updateCampaign,
    removeUserFromCampaign,
    getAllCampaignsFromDb,
    getCampaignByIdFromDb,
    deleteCampaignFromDb
} = require('../controller/campaignController');

const router = express.Router();

// Create Campaign
router.post('/campaigns', postCampaign);
// Add User to Campaign 
router.post('/addUser', addUserToCampaign);
// Get All Campaigns from DB
router.get('/campaigns', getAllCampaignsFromDb);
// Get Campaign by ID from DB
router.get('/campaigns/:id', getCampaignByIdFromDb);
// Update Campaign
router.put('/campaigns/:id', updateCampaign);
// Delete Campaign from DB
router.delete('/campaigns/:id', deleteCampaignFromDb);
// Remove User from Campaign
router.delete('/removeUser', removeUserFromCampaign);

module.exports = router;
