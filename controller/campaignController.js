const Campaign = require('../models/campaign');
const User = require('../models/user');

// Create Campaign
const postCampaign = async (req, res) => {
    try {
        const { user_id, title, description, budget, status, start_date, end_date } = req.body;

        // Validasi input
        if (!user_id || !title || !description || !budget || !status || !start_date || !end_date) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Buat campaign baru
        const newCampaign = await Campaign.create({ user_id, title, description, budget, status, start_date, end_date });

        res.status(201).json({ message: "Campaign created successfully!", campaign: newCampaign });
    } catch (error) {
        res.status(500).json({ message: "Error creating campaign", error: error.message });
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
            include: { model: User, attributes: ['name', 'email'] }
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

module.exports = { 
    postCampaign, 
    getAllCampaigns, 
    getCampaignById, 
    updateCampaign, 
    deleteCampaign 
};
