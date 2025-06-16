const express = require('express');
const router = express.Router();
const { extractUserFromHeader } = require('../middleware/extractUser');

const {
    postReport,
    getReportsByCampaignId,
    updateReport,
    deleteReport,
    getAllReports,
    getReportById,
} = require('../controllers/reportController');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: API for managing reports in campaigns
 */
router.post('/', extractUserFromHeader, postReport);

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get all reports
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: A list of reports
 */
router.get('/', getAllReports);

/**
 * @swagger
 * /reports/{report_id}:
 *   get:
 *     summary: Get a report by ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: report_id
 *         required: true
 *         description: The ID of the report to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A report object
 */
router.get('/:report_id', getReportById);

/**
 * @swagger
 * /reports/campaign/{campaign_id}:
 *   get:
 *     summary: Get reports by campaign ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: campaign_id
 *         required: true
 *         description: The ID of the campaign to retrieve reports for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reports for the specified campaign
 */
router.get('/campaign/:campaign_id', getReportsByCampaignId);

/**
 * @swagger
 * /reports/{report_id}:
 *   put:
 *     summary: Update a report by ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: report_id
 *         required: true
 *         description: The ID of the report to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The updated report object
 */
router.put('/:report_id', extractUserFromHeader, updateReport);

/**
 * @swagger
 * /reports/{report_id}:
 *   delete:
 *     summary: Delete a report by ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: report_id
 *         required: true
 *         description: The ID of the report to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A message confirming the deletion of the report
 */
router.delete('/:report_id', extractUserFromHeader, deleteReport);

module.exports = router;
