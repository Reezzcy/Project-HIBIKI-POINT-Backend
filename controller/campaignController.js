const { Campaign, User } = require('../models');

// Create Campaign
const postCampaign = async (req, res) => {
    try {
        const { user_id, title, description, budget, status, start_date, end_date } = req.body;

        // Validasi input
        if (!user_id || !title || !description || !budget || !status || !start_date || !end_date) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Buat campaign baru
        const newCampaign = await Campaign.create({ user_id, title, description, budget, status, start_date, end_date });
        await user.addCampaign(newCampaign);

        res.status(201).json({ message: "Campaign created successfully!", campaign: newCampaign });
    } catch (error) {
        res.status(500).json({ message: "Error creating campaign", error: error.message });
    }
};

// Add User to Campaign
const addUserToCampaign = async (req, res) => {
    try {
        const { userId, campaignId } = req.body;

        const user = await User.findByPk(userId);
        const campaign = await Campaign.findByPk(campaignId);

        if (!user || !campaign) {
            return res.status(404).json({ message: "User or Campaign not found!" });
        }

        await user.addCampaign(campaign);
        
        res.status(200).json({ message: "User added to campaign successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding user to campaign", error: error.message });
    }
};

// Get All Camapaign
const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.findAll({
            include: { model: User, attributes: ['name', 'email'] } // Sertakan info user yang memiliki campaign
        });

        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: "Error fetching campaigns", error: error.message });
    }
};

// Get All Campaign by Id
const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findByPk(id, {
            include: { model: User, as : 'users', attributes: ['name', 'email'], through: { attributes: [] } }
        });

        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: "Error fetching campaign", error: error.message });
    }
};

// Update Camapign
const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, budget, status, start_date, end_date } = req.body;

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        await campaign.update({ title, description, budget, status, start_date, end_date });

        res.status(200).json({ message: "Campaign updated successfully", campaign });
    } catch (error) {
        res.status(500).json({ message: "Error updating campaign", error: error.message });
    }
};

// Delete Campaign
const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findByPk(id);

        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        await campaign.destroy();
        res.status(200).json({ message: "Campaign deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting campaign", error: error.message });
    }
};

const removeUserFromCampaign = async (req, res) => {
    try {
        const { userId, campaignId } = req.body;

        const user = await User.findByPk(userId);
        const campaign = await Campaign.findByPk(campaignId);

        if (!user || !campaign) {
            return res.status(404).json({ message: "User or Campaign not found!" });
        }

        await user.removeCampaign(campaign);
        res.status(200).json({ message: "User removed from campaign successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error removing user from campaign", error: error.message });
    }
};

module.exports = { 
    postCampaign,
    addUserToCampaign, 
    getAllCampaigns, 
    getCampaignById, 
    updateCampaign, 
    deleteCampaign,
    removeUserFromCampaign
};
