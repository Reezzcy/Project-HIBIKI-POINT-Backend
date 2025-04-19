const express = require('express');
const router = express.Router();

const {
    addComment,
    getCommentFromCache,
    deleteCommentFromCache,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment,
} = require('../controller/commentController');

// Create a new comment
router.post('/comments', addComment);
// Get all comments
router.get('/comments', getAllComments);
// Get a comment by ID
router.get('/comments/:id', getCommentById);
// Update a comment
router.put('/comments/:id', updateComment);
// Delete a comment
router.delete('/comments/:id', deleteComment);
// Get comment from cache
router.get('/comments/cache/:id', getCommentFromCache);
// Delete comment from cache
router.delete('/comments/cache/:id', deleteCommentFromCache);

module.exports = router;
