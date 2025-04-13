const { Campaign, Report } = require('../database/models');

// Create Report
postReport = async (req, res) => {
    try {
        const { campaign_id, total_reach, roi, report_date } = req.body;

        const newReport = await Report.create({
            campaign_id,
            total_reach,
            roi,
            report_date
        });

        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Reports
getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: {
                model: Campaign,
                attributes: ['campaign_id', 'title']
            }
        });

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Report by ID
getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Report.findOne({
            where: { report_id: id },
            include: {
                model: Campaign,
                attributes: ['campaign_id', 'title']
            }
        });

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Report
updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { total_reach, roi, report_date } = req.body;

        const report = await Report.findByPk(id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        await report.update({ total_reach, roi, report_date });

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Report
deleteReport = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Report.findByPk(id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        await report.destroy();

        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    postReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport
};
