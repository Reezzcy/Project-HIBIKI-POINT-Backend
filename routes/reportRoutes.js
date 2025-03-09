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
router.post('/Reports', postReport);
// Get All Reports
router.get('/Reports', getAllReports);
// Get Report by ID
router.get('/Reports/:id', getReportById);
// Update Report
router.put('/Reports/:id', updateReport);
// Delete Report
router.delete('/Reports/:id', deleteReport);

module.exports = router;
