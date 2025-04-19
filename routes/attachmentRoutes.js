const express = require('express');
const router = express.Router();

const {
    addAttachment,
    getAttachmentFromCache,
    deleteAttachmentFromCache,
    getAttachmentFromDb,
    updateAttachmentInDb,
    deleteAttachmentFromDb
} = require('../controller/attachmentController');

// Route for adding attachment
router.post('/attachments', addAttachment);
// Route for getting attachment from cache by user_id
router.get('/attachments/cache/:user_id', getAttachmentFromCache);
// Route for deleting attachment from cache by user_id
router.delete('/attachments/cache/:user_id', deleteAttachmentFromCache);
// Route for getting attachment from DB by user_id
router.get('/attachments/db/:user_id', getAttachmentFromDb);
// Route for updating attachment in DB by user_id
router.put('/attachments/db/:user_id', updateAttachmentInDb);
// Route for deleting attachment from DB by user_id
router.delete('/attachments/db/:user_id', deleteAttachmentFromDb);

module.exports = router;
