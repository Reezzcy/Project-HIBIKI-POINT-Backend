const { Campaign, UserCampaign, Task } = require('../models');
const { publishEvent } = require('../publisher');

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
        publishEvent('campaign.created', {
            campaignId: newCampaign.campaign_id,
            title: newCampaign.title,
            creatorId: creatorId,
            participantIds: allParticipantIds,
        });

        res.status(201).json(newCampaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan semua campaign
const getAllCampaigns = async (req, res) => {
    try {
        // Query sederhana tanpa join ke User
        const campaigns = await Campaign.findAll({
            include: [{ model: Task }], // Boleh join ke tabel lain di service yang sama
        });
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Campaign
const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const updaterId = req.user.id;

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        await campaign.update(req.body);

        // Terbitkan Event
        publishEvent('campaign.updated', {
            campaignId: campaign.campaign_id,
            updatedBy: updaterId,
            changes: req.body,
        });

        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Campaign
const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const deleterId = req.user.id;

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        await campaign.destroy();

        // Terbitkan Event
        publishEvent('campaign.deleted', {
            campaignId: id,
            deletedBy: deleterId,
        });

        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tambah partisipan ke campaign
const addParticipantToCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // ID user yang akan ditambahkan

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Cek apakah user sudah menjadi partisipan
        const existingParticipant = await UserCampaign.findOne({
            where: { campaign_id: id, user_id: userId },
        });
        if (existingParticipant) {
            return res
                .status(400)
                .json({ message: 'User already a participant' });
        }

        // Tambahkan partisipan baru
        await UserCampaign.create({
            campaign_id: id,
            user_id: userId,
        });

        // Terbitkan Event
        publishEvent('campaign.participant.added', {
            campaignId: id,
            userId: userId,
        });

        res.status(200).json({ message: 'Participant added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hapus partisipan dari campaign
const removeParticipantFromCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // ID user yang akan dihapus

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Cek apakah user adalah partisipan
        const participant = await UserCampaign.findOne({
            where: { campaign_id: id, user_id: userId },
        });
        if (!participant) {
            return res.status(404).json({ message: 'Participant not found' });
        }

        // Hapus partisipan
        await participant.destroy();

        // Terbitkan Event
        publishEvent('campaign.participant.removed', {
            campaignId: id,
            userId: userId,
        });

        res.status(200).json({ message: 'Participant removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Ambil daftar ID partisipan
        const participantIds = campaign.UserCampaigns.map((uc) => uc.user_id);

        res.status(200).json(participantIds);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
