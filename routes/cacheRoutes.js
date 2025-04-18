const express = require('express');
const router = express.Router();
const { 
    getCampaignFromCache, 
    setCampaignToCache, 
    deleteCampaignFromCache 
} = require('../controller/cacheController');

// Get campaign from cache
router.get('/campaign/:id', getCampaignFromCache);
// Save campaign to cache
router.post('/campaign/:id', setCampaignToCache);
// Delete campaign from cache
router.delete('/campaign/:id', deleteCampaignFromCache);

module.exports = router;