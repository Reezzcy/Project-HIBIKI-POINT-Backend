const express = require('express');

const {
    postCampaign,
    addUserToCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    removeUserFromCampaign
} = require('../controller/campaignController');

const router = express.Router();

// Create Campaign
router.post('/campaigns', postCampaign);
// Add User to Campaign
router.post('/addUser', addUserToCampaign);
// Get All Campaigns
router.get('/campaigns', getAllCampaigns);
// Get Campaign by ID
router.get('/campaigns/:id', getCampaignById);
// Update Campaign
router.put('/campaigns/:id', updateCampaign);
// Delete Campaign
router.delete('/campaigns/:id', deleteCampaign);
// Remove User from Campaign
router.delete('/removeUser', removeUserFromCampaign);

module.exports = router;
