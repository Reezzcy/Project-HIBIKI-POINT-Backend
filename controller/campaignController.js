const { Campaign, User } = require('../database/models');
const redis = require('../config/redis');
const { saveLogActivity } = require('../service/logActivityService');

// Create Campaign
const postCampaign = async (req, res) => {
    try {
        const {
            user_id,
            title,
            description,
            budget,
            status,
            start_date,
            end_date,
        } = req.body;

        if (
            !user_id ||
            !title ||
            !description ||
            !budget ||
            !status ||
            !start_date ||
            !end_date
        ) {
            return res
                .status(400)
                .json({ message: 'All fields are required!' });
        }

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const newCampaign = await Campaign.create({
            user_id,
            title,
            description,
            budget,
            status,
            start_date,
            end_date,
        });
        await user.addCampaign(newCampaign);

        saveLog = await saveLogActivity({
            user_id: user_id,
            activity_type: 'create campaign',
            activity_description: `Created a new campaign with title: ${title}`,
        });

        await redis.del('all_campaigns');
        return res.status(201).json({
            message: 'Campaign created successfully!',
            campaign: newCampaign,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating campaign',
            error: error.message,
        });
    }
};

// Add User to Campaign
const addUserToCampaign = async (req, res) => {
    try {
        const { user_id, campaign_id } = req.body;

        const user = await User.findByPk(user_id);
        const campaign = await Campaign.findByPk(campaign_id);

        if (!user || !campaign) {
            return res
                .status(404)
                .json({ message: 'User or Campaign not found!' });
        }

        await user.addCampaign(campaign);

        await redis.del(`campaign_${campaign_id}`);
        await redis.del('all_campaigns');
        return res
            .status(200)
            .json({ message: 'User added to campaign successfully!' });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding user to campaign',
            error: error.message,
        });
    }
};

// Update Campaign
const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, budget, status, start_date, end_date } =
            req.body;

        const campaign = await Campaign.findByPk(id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        await campaign.update({
            title,
            description,
            budget,
            status,
            start_date,
            end_date,
        });

        await redis.del(`campaign_${id}`);
        await redis.del('all_campaigns');
        return res
            .status(200)
            .json({ message: 'Campaign updated successfully', campaign });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating campaign',
            error: error.message,
        });
    }
};

// Remove User from Campaign
const removeUserFromCampaign = async (req, res) => {
    try {
        const { user_id, campaign_id } = req.body;

        const user = await User.findByPk(user_id);
        const campaign = await Campaign.findByPk(campaign_id);

        if (!user || !campaign) {
            return res
                .status(404)
                .json({ message: 'User or Campaign not found!' });
        }

        await user.removeCampaign(campaign);

        await redis.del(`campaign_${campaign_id}`);
        await redis.del('all_campaigns');
        return res
            .status(200)
            .json({ message: 'User removed from campaign successfully!' });
    } catch (error) {
        res.status(500).json({
            message: 'Error removing user from campaign',
            error: error.message,
        });
    }
};

// Fetch Campaigns from Cache
const getAllCampaignsFromCache = async (req, res) => {
    try {
        const cachedCampaigns = await redis.get('all_campaigns');

        if (cachedCampaigns) {
            return res.status(200).json(JSON.parse(cachedCampaigns));
        }

        return res
            .status(404)
            .json({ message: 'Campaigns not found in cache' });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching from cache',
            error: error.message,
        });
    }
};

// Fetch Campaigns from Database
const getAllCampaignsFromDb = async (req, res) => {
    try {
        const campaigns = await Campaign.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                    as: 'users',
                    through: { attributes: [] },
                },
            ],
        });

        if (!campaigns) {
            return res.status(404).json({ message: 'Campaigns not found' });
        }

        await redis.set('all_campaigns', JSON.stringify(campaigns), 'EX', 3600);
        return res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching from DB',
            error: error.message,
        });
    }
};

// Fetch Campaign by ID from Cache
const getCampaignByIdFromCache = async (req, res) => {
    try {
        const { id } = req.params;
        const cachedCampaign = await redis.get(`campaign_${id}`);

        if (cachedCampaign) {
            return res.status(200).json(JSON.parse(cachedCampaign));
        }

        return res.status(404).json({ message: 'Campaign not found in cache' });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching from cache',
            error: error.message,
        });
    }
};

// Fetch Campaign by ID from DB
const getCampaignByIdFromDb = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findByPk(id, {
            include: {
                model: User,
                as: 'users',
                attributes: ['name'],
                through: { attributes: [] },
            },
        });

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        await redis.set(`campaign_${id}`, JSON.stringify(campaign), 'EX', 3600);
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching from DB',
            error: error.message,
        });
    }
};

// Delete Campaign from Cache
const deleteCampaignFromCache = async (req, res) => {
    try {
        const { id } = req.params;
        const cachedCampaign = await redis.get(`campaign_${id}`);

        if (cachedCampaign) {
            await redis.del(`campaign_${id}`);
            return res.status(200).json({
                message: `Campaign with ID ${id} deleted successfully`,
            });
        }

        return res.status(404).json({ message: `Campaign not found` });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting campaign from DB',
            error: error.message,
        });
    }
};

// Delete All Campaigns from Cache
const deleteAllCampaignsFromCache = async (req, res) => {
    try {
        const cachedCampaigns = await redis.get('all_campaigns');

        if (cachedCampaigns) {
            await redis.del('all_campaigns');
            return res
                .status(200)
                .json({ message: 'All campaigns cache deleted successfully' });
        }

        return res
            .status(404)
            .json({ message: 'No cache found for all campaigns' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting campaign from DB',
            error: error.message,
        });
    }
};

// Delete Campaign from DB
const deleteCampaignFromDb = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findByPk(id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        await campaign.destroy();
        return res
            .status(200)
            .json({ message: `Campaign with ID ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting campaign from DB',
            error: error.message,
        });
    }
};

module.exports = {
    postCampaign,
    addUserToCampaign,
    updateCampaign,
    removeUserFromCampaign,
    getAllCampaignsFromCache,
    getAllCampaignsFromDb,
    getCampaignByIdFromCache,
    getCampaignByIdFromDb,
    deleteCampaignFromCache,
    deleteAllCampaignsFromCache,
    deleteCampaignFromDb,
};
