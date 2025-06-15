const { Report, Campaign } = require('../models');
const { publishEvent } = require('../publisher');

const postReport = async (req, res) => {
    try {
        const creatorId = req.user.id;
        const { campaign_id, total_reach, roi, report_date } = req.body;

        const newReport = await Report.create({
            campaign_id,
            total_reach,
            roi,
            report_date,
        });

        publishEvent('report.created', {
            reportId: newReport.report_id,
            campaignId: campaign_id,
            creatorId: creatorId,
        });

        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReportsByCampaignId = async (req, res) => {
    try {
        const { campaign_id } = req.params;
        const reports = await Report.findAll({ where: { campaign_id } });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateReport = async (req, res) => {
    try {
        const { report_id } = req.params;
        const updaterId = req.user.id;

        const report = await Report.findByPk(report_id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        await report.update(req.body);

        publishEvent('report.updated', {
            reportId: report_id,
            updatedBy: updaterId,
            changes: req.body,
        });

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteReport = async (req, res) => {
    try {
        const { report_id } = req.params;
        const deleterId = req.user.id;

        const report = await Report.findByPk(report_id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        await report.destroy();

        publishEvent('report.deleted', {
            reportId: report_id,
            deletedBy: deleterId,
        });

        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [
                {
                    model: Campaign,
                    as: 'campaign',
                    attributes: ['campaign_id', 'name'],
                },
            ],
        });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReportById = async (req, res) => {
    try {
        const { report_id } = req.params;

        const report = await Report.findByPk(report_id, {
            include: [
                {
                    model: Campaign,
                    as: 'campaign',
                    attributes: ['campaign_id', 'name'],
                },
            ],
        });

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    postReport,
    getReportsByCampaignId,
    updateReport,
    deleteReport,
    getAllReports,
    getReportById,
};
