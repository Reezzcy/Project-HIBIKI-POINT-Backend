const { Campaign, UserCampaign, Task } = require('../models');
const { publishEvent } = require('../publisher');
const { Op } = require('sequelize'); // Import Op for date comparisons

// Membuat campaign baru
const postCampaign = async (req, res) => {
    try {
        const creatorId = req.user.id; // Diambil dari token JWT yang sudah diverifikasi
        const {
            title,
            description,
            budget,
            status,
            start_date,
            end_date,
            participants = [],
        } = req.body;

        const newCampaign = await Campaign.create({
            user_id: creatorId, // ID dari user yang membuat
            title,
            description,
            budget,
            status,
            start_date,
            end_date,
        });

        // Tambahkan partisipan (termasuk pembuat) ke tabel pivot
        const allParticipantIds = [...new Set([creatorId, ...participants])];
        const participantEntries = allParticipantIds.map((userId) => ({
            user_id: userId,
            campaign_id: newCampaign.campaign_id,
        }));
        await UserCampaign.bulkCreate(participantEntries);

        // Terbitkan Event
        // Ensure publishEvent is defined and accessible in this scope
        // If publishEvent is not globally available, you might need to import it.
        if (typeof publishEvent === 'function') {
            publishEvent('campaign.created', {
                campaignId: newCampaign.campaign_id,
                title: newCampaign.title,
                creatorId: creatorId,
                participantIds: allParticipantIds,
            });
        } else {
            console.warn('publishEvent function is not defined.');
            // Handle cases where publishEvent might not be available
        }

        // Successful response in the desired format
        res.status(201).json({
            status: 'success',
            message: 'Campaign created successfully.',
            data: newCampaign, // The newly created campaign object
        });
    } catch (error) {
        // Error response in the desired format
        res.status(500).json({
            status: 'error',
            message: 'Failed to create campaign.',
            data: {
                details: error.message, // Provide error details for debugging
            },
        });
    }
};

// Mendapatkan semua campaign
const getAllCampaigns = async (req, res) => {
    try {
        // Query sederhana tanpa join ke User
        const campaigns = await Campaign.findAll({
            include: [{ model: Task }], // Boleh join ke tabel lain di service yang sama
        });
        res.status(200).json({
            status: 'success',
            message: 'All campaigns retrieved successfully.',
            data: campaigns,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve campaigns.',
            data: { details: error.message },
        });
    }
};

// Mendapatkan campaign by ID
const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findByPk(id, {
            // Dapatkan juga daftar ID partisipan dari tabel pivot
            include: [{ model: UserCampaign, attributes: ['user_id'] }],
        });

        if (!campaign) {
            return res.status(404).json({
                status: 'fail',
                message: 'Campaign not found.',
                data: null,
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Campaign retrieved successfully.',
            data: campaign,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve campaign.',
            data: { details: error.message },
        });
    }
};

// Update Campaign
const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const updaterId = req.user.id;

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({
                status: 'fail',
                message: 'Campaign not found.',
                data: null,
            });
        }

        await campaign.update(req.body);

        // Terbitkan Event
        if (typeof publishEvent === 'function') {
            publishEvent('campaign.updated', {
                campaignId: campaign.campaign_id,
                updatedBy: updaterId,
                changes: req.body,
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        res.status(200).json({
            status: 'success',
            message: 'Campaign updated successfully.',
            data: campaign,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to update campaign.',
            data: { details: error.message },
        });
    }
};

// Delete Campaign
const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const deleterId = req.user.id;

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({
                status: 'fail',
                message: 'Campaign not found.',
                data: null,
            });
        }

        await campaign.destroy();

        // Terbitkan Event
        if (typeof publishEvent === 'function') {
            publishEvent('campaign.deleted', {
                campaignId: id,
                deletedBy: deleterId,
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        res.status(200).json({
            status: 'success',
            message: 'Campaign deleted successfully.',
            data: null, // No specific data to return on delete success
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete campaign.',
            data: { details: error.message },
        });
    }
};

// Tambah partisipan ke campaign
const addParticipantToCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // ID user yang akan ditambahkan

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({
                status: 'fail',
                message: 'Campaign not found.',
                data: null,
            });
        }

        // Cek apakah user sudah menjadi partisipan
        const existingParticipant = await UserCampaign.findOne({
            where: { campaign_id: id, user_id: userId },
        });
        if (existingParticipant) {
            return res.status(400).json({
                status: 'fail',
                message: 'User already a participant in this campaign.',
                data: null,
            });
        }

        // Tambahkan partisipan baru
        await UserCampaign.create({
            campaign_id: id,
            user_id: userId,
        });

        // Terbitkan Event
        if (typeof publishEvent === 'function') {
            publishEvent('campaign.participant.added', {
                campaignId: id,
                userId: userId,
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        res.status(200).json({
            status: 'success',
            message: 'Participant added successfully.',
            data: { campaign_id: id, user_id: userId },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to add participant to campaign.',
            data: { details: error.message },
        });
    }
};

// Hapus partisipan dari campaign
const removeParticipantFromCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // ID user yang akan dihapus

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({
                status: 'fail',
                message: 'Campaign not found.',
                data: null,
            });
        }

        // Cek apakah user adalah partisipan
        const participant = await UserCampaign.findOne({
            where: { campaign_id: id, user_id: userId },
        });
        if (!participant) {
            return res.status(404).json({
                status: 'fail',
                message: 'Participant not found in this campaign.',
                data: null,
            });
        }

        // Hapus partisipan
        await participant.destroy();

        // Terbitkan Event
        if (typeof publishEvent === 'function') {
            publishEvent('campaign.participant.removed', {
                campaignId: id,
                userId: userId,
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        res.status(200).json({
            status: 'success',
            message: 'Participant removed successfully.',
            data: { campaign_id: id, user_id: userId },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to remove participant from campaign.',
            data: { details: error.message },
        });
    }
};

// Mendapatkan semua partisipan dari campaign
const getCampaignParticipants = async (req, res) => {
    try {
        const { id } = req.params;

        const campaign = await Campaign.findByPk(id, {
            include: [{ model: UserCampaign, attributes: ['user_id'] }],
        });

        if (!campaign) {
            return res.status(404).json({
                status: 'fail',
                message: 'Campaign not found.',
                data: null,
            });
        }

        // Ambil daftar ID partisipan
        const participantIds = campaign.UserCampaigns.map((uc) => uc.user_id);

        res.status(200).json({
            status: 'success',
            message: 'Campaign participants retrieved successfully.',
            data: participantIds,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve campaign participants.',
            data: { details: error.message },
        });
    }
};

// Mendapatkan semua campaign yang dibuat oleh user tertentu
const getCampaignsByCreator = async (req, res) => {
    try {
        const creatorId = req.user.id; // ID dari user yang membuat
        const campaigns = await Campaign.findAll({
            where: { user_id: creatorId },
            include: [{ model: Task }], // Boleh join ke tabel lain di service yang sama
        });
        res.status(200).json({
            status: 'success',
            message: 'Campaigns by creator retrieved successfully.',
            data: campaigns,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve campaigns by creator.',
            data: { details: error.message },
        });
    }
};

// Mendapatkan semua campaign yang diikuti oleh user tertentu
const getCampaignsByParticipant = async (req, res) => {
    try {
        const userId = req.user.id; // ID dari user yang mengikuti
        const campaigns = await Campaign.findAll({
            include: [
                {
                    model: UserCampaign,
                    where: { user_id: userId },
                    attributes: [],
                },
            ],
            attributes: { exclude: ['user_id'] }, // Exclude creator ID
        });
        res.status(200).json({
            status: 'success',
            message: 'Campaigns by participant retrieved successfully.',
            data: campaigns,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve campaigns by participant.',
            data: { details: error.message },
        });
    }
};

// Mendapatkan semua campaign berdasarkan status
const getCampaignsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const campaigns = await Campaign.findAll({
            where: { status },
            include: [{ model: Task }], // Boleh join ke tabel lain di service yang sama
        });
        res.status(200).json({
            status: 'success',
            message: `Campaigns with status '${status}' retrieved successfully.`,
            data: campaigns,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve campaigns by status.',
            data: { details: error.message },
        });
    }
};

// Mendapatkan semua campaign yang sedang berlangsung
const getOngoingCampaigns = async (req, res) => {
    try {
        const currentDate = new Date();
        const campaigns = await Campaign.findAll({
            where: {
                start_date: { [Op.lte]: currentDate },
                end_date: { [Op.gte]: currentDate },
            },
            include: [{ model: Task }], // Boleh join ke tabel lain di service yang sama
        });
        res.status(200).json({
            status: 'success',
            message: 'Ongoing campaigns retrieved successfully.',
            data: campaigns,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve ongoing campaigns.',
            data: { details: error.message },
        });
    }
};

// Mendapatkan semua campaign yang telah selesai
const getCompletedCampaigns = async (req, res) => {
    try {
        const currentDate = new Date();
        const campaigns = await Campaign.findAll({
            where: {
                end_date: { [Op.lt]: currentDate },
            },
            include: [{ model: Task }], // Boleh join ke tabel lain di service yang sama
        });
        res.status(200).json({
            status: 'success',
            message: 'Completed campaigns retrieved successfully.',
            data: campaigns,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve completed campaigns.',
            data: { details: error.message },
        });
    }
};

// Mendapatkan semua campaign yang belum dimulai
const getUpcomingCampaigns = async (req, res) => {
    try {
        const currentDate = new Date();
        const campaigns = await Campaign.findAll({
            where: {
                start_date: { [Op.gt]: currentDate },
            },
            include: [{ model: Task }], // Boleh join ke tabel lain di service yang sama
        });
        res.status(200).json({
            status: 'success',
            message: 'Upcoming campaigns retrieved successfully.',
            data: campaigns,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve upcoming campaigns.',
            data: { details: error.message },
        });
    }
};

module.exports = {
    postCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    addParticipantToCampaign,
    removeParticipantFromCampaign,
    getCampaignParticipants,
    getCampaignsByCreator,
    getCampaignsByParticipant,
    getCampaignsByStatus,
    getOngoingCampaigns,
    getCompletedCampaigns,
    getUpcomingCampaigns,
};
