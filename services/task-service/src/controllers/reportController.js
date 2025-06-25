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

        // Terbitkan Event
        if (typeof publishEvent === 'function') {
            publishEvent('report.created', {
                reportId: newReport.report_id,
                campaignId: campaign_id,
                creatorId: creatorId,
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        res.status(201).json({
            status: 'success',
            message: 'Report created successfully.',
            data: newReport,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to create report.',
            data: { details: error.message },
        });
    }
};

const getReportsByCampaignId = async (req, res) => {
    try {
        const { campaign_id } = req.params;
        const reports = await Report.findAll({ where: { campaign_id } });

        if (!reports || reports.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: `No reports found for campaign ID ${campaign_id}.`,
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Reports for campaign ID ${campaign_id} retrieved successfully.`,
            data: reports,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve reports by campaign ID.',
            data: { details: error.message },
        });
    }
};

const updateReport = async (req, res) => {
    try {
        const { report_id } = req.params;
        const updaterId = req.user.id;

        const report = await Report.findByPk(report_id);
        if (!report) {
            return res.status(404).json({
                status: 'fail',
                message: 'Report not found.',
                data: null,
            });
        }

        await report.update(req.body);

        // Terbitkan Event
        if (typeof publishEvent === 'function') {
            publishEvent('report.updated', {
                reportId: report_id,
                updatedBy: updaterId,
                changes: req.body,
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        res.status(200).json({
            status: 'success',
            message: 'Report updated successfully.',
            data: report,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to update report.',
            data: { details: error.message },
        });
    }
};

const deleteReport = async (req, res) => {
    try {
        const { report_id } = req.params;
        const deleterId = req.user.id;

        const report = await Report.findByPk(report_id);
        if (!report) {
            return res.status(404).json({
                status: 'fail',
                message: 'Report not found.',
                data: null,
            });
        }

        await report.destroy();

        // Terbitkan Event
        if (typeof publishEvent === 'function') {
            publishEvent('report.deleted', {
                reportId: report_id,
                deletedBy: deleterId,
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        res.status(200).json({
            status: 'success',
            message: 'Report deleted successfully.',
            data: null, // No specific data to return on delete success
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete report.',
            data: { details: error.message },
        });
    }
};

const getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [
                {
                    model: Campaign,
                    attributes: ['campaign_id', 'title'],
                },
            ],
        });
        res.status(200).json({
            status: 'success',
            message: 'All reports retrieved successfully.',
            data: reports,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve all reports.',
            data: { details: error.message },
        });
    }
};

const getReportById = async (req, res) => {
    try {
        const { report_id } = req.params;

        const report = await Report.findByPk(report_id, {
            include: [
                {
                    model: Campaign,
                    attributes: ['campaign_id', 'title'],
                },
            ],
        });

        if (!report) {
            return res.status(404).json({
                status: 'fail',
                message: 'Report not found.',
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Report retrieved successfully.',
            data: report,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve report.',
            data: { details: error.message },
        });
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
