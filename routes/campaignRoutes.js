const express = require('express');

const {
    postCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign
} = require('../controller/campaignController');

const router = express.Router();

// Create Campaign
router.post('/campaigns', postCampaign);
// Get All Campaigns
router.get('/campaigns', getAllCampaigns);
// Get Campaign by ID
router.get('/campaigns/:id', getCampaignById);
// Update Campaign
router.put('/campaigns/:id', updateCampaign);
// Delete Campaign
router.delete('/campaigns/:id', deleteCampaign);

module.exports = router;
