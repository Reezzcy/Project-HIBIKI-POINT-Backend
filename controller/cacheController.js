const redis = require('../config/redis');
const { Campaign, User } = require('../database/models');

// Get Campaign from Cache
const getCampaignFromCache = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `campaign_${id}`;

        // Check if the data is in the cache
        const cachedData = await redis.get(cacheKey);
        if (!cachedData) {
            return res.status(404).json({ message: "Campaign not found in cache" });
        }

        res.status(200).json(JSON.parse(cachedData));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving campaign from cache", error: error.message });
    }
};

// Set Campaign in Cache
const setCampaignToCache = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, title, description, budget, status, start_date, end_date } = req.body;

        // Validate input
        if (!user_id || !title || !description || !budget || !status || !start_date || !end_date) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Create campaign object to save in cache
        const campaignData = {
            campaign_id: id,
            user_id,
            title,
            description,
            budget,
            status,
            start_date,
            end_date
        };

        // Save to Redis cache
        await redis.set(`campaign_${id}`, JSON.stringify(campaignData), 'EX', 3600); // Cache for 1 hour

        res.status(200).json({ message: "Campaign cached successfully!", campaign: campaignData });
    } catch (error) {
        res.status(500).json({ message: "Error saving campaign to cache", error: error.message });
    }
};

// Delete Campaign from Cache
const deleteCampaignFromCache = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete from Redis cache
        const result = await redis.del(`campaign_${id}`);
        if (result === 0) {
            return res.status(404).json({ message: "Campaign not found in cache" });
        }

        res.status(200).json({ message: "Campaign deleted from cache successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting campaign from cache", error: error.message });
    }
};

module.exports = {
    getCampaignFromCache,
    setCampaignToCache,
    deleteCampaignFromCache
};
