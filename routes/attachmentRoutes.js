const express = require('express');
const router = express.Router();

const {
    getAttachmentsFromDb,
    getAttachmentByIdFromDb,
    updateAttachment,
    deleteAttachmentFromDb,
} = require('../controller/attachmentController');

// Get All Attachments from DB
router.get('/attachments', getAttachmentsFromDb);

// Get Attachment by ID from DB
router.get('/attachments/:id', getAttachmentByIdFromDb);

// Update Attachment
router.put('/attachments/:id', updateAttachment);

// Delete Attachment from DB
router.delete('/attachments/:id', deleteAttachmentFromDb);

module.exports = router;
