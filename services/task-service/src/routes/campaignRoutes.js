const express = require('express');
const router = express.Router();

const {
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
} = require('../controllers/campaignController');

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: API for managing campaigns
 */
router.post('/', postCampaign);

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: A list of campaigns
 */
router.get('/', getAllCampaigns);

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Get a campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the campaign to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A campaign object
 */
router.get('/:id', getCampaignById);

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Update a campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the campaign to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated campaign object
 */
router.put('/:id', updateCampaign);

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Delete a campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the campaign to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign deleted successfully
 */
router.delete('/:id', deleteCampaign);

/**
 * @swagger
 * /campaigns/{id}/participants:
 *   post:
 *     summary: Add a participant to a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the campaign to add a participant to
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participantId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Participant added successfully
 */
router.post('/:id/participants', addParticipantToCampaign);

/**
 * @swagger
 * /campaigns/{id}/participants/{participantId}:
 *   delete:
 *     summary: Remove a participant from a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the campaign
 *         schema:
 *           type: string
 *       - in: path
 *         name: participantId
 *         required: true
 *         description: The ID of the participant to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Participant removed successfully
 */
router.delete(
    '/:id/participants/:participantId',
    removeParticipantFromCampaign
);

/**
 * @swagger
 * /campaigns/{id}/participants:
 *   get:
 *     summary: Get participants of a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the campaign to retrieve participants for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of participants in the campaign
 */
router.get('/:id/participants', getCampaignParticipants);

/**
 * @swagger
 * /campaigns/creator/{creatorId}:
 *   get:
 *     summary: Get campaigns by creator ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: creatorId
 *         required: true
 *         description: The ID of the creator to retrieve campaigns for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of campaigns created by the specified creator
 */
router.get('/creator/:creatorId', getCampaignsByCreator);

/**
 * @swagger
 * /campaigns/participant/{participantId}:
 *   get:
 *     summary: Get campaigns by participant ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: participantId
 *         required: true
 *         description: The ID of the participant to retrieve campaigns for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of campaigns the specified participant is involved in
 */
router.get('/participant/:participantId', getCampaignsByParticipant);

/**
 * @swagger
 * /campaigns/status/{status}:
 *   get:
 *     summary: Get campaigns by status
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         description: The status of the campaigns to retrieve (e.g., ongoing, completed, upcoming)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of campaigns with the specified status
 */
router.get('/status/:status', getCampaignsByStatus);

/**
 * @swagger
 * /campaigns/ongoing:
 *   get:
 *     summary: Get ongoing campaigns
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: A list of ongoing campaigns
 */
router.get('/ongoing', getOngoingCampaigns);

/**
 * @swagger
 * /campaigns/completed:
 *   get:
 *     summary: Get completed campaigns
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: A list of completed campaigns
 */
router.get('/completed', getCompletedCampaigns);

/**
 * @swagger
 * /campaigns/upcoming:
 *   get:
 *     summary: Get upcoming campaigns
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: A list of upcoming campaigns
 */
router.get('/upcoming', getUpcomingCampaigns);

module.exports = router;
