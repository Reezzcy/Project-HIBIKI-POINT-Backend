const express = require('express');

const {
    postReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport
} = require('../controller/reportController');

const router = express.Router();

// Create Report
router.post('/reports', postReport);
// Get All Reports
router.get('/reports', getAllReports);
// Get Report by ID
router.get('/reports/:id', getReportById);
// Update Report
router.put('/reports/:id', updateReport);
// Delete Report
router.delete('/reports/:id', deleteReport);

module.exports = router;
