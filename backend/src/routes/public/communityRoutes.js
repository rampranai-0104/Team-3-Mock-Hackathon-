const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const { optionalAuth } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { uploadPostImages } = require('../../middleware/uploadMiddleware');
const {
    validateCreatePost,
    validateUpdatePost,
    validateComment
} = require('../../validators/communityValidator');
const {
    createPost,
    getFeed,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    getComments,
    deleteComment,
    getPopularHashtags,
    getPostsByEvent,
    getPostsByArtForm
} = require('../../controllers/public/communityController');

const route = express.Router();

route.post('/posts', authMiddleware, authorizeRoles('public', 'institution', 'admin'), uploadPostImages, validateCreatePost, createPost);
route.get('/posts', optionalAuth, getFeed);
route.get('/posts/:postId', optionalAuth, getPostById);
route.put('/posts/:postId', authMiddleware, authorizeRoles('public', 'institution', 'admin'), uploadPostImages, validateUpdatePost, updatePost);
route.delete('/posts/:postId', authMiddleware, authorizeRoles('public', 'institution', 'admin'), deletePost);

route.post('/posts/:postId/like', authMiddleware, authorizeRoles('public', 'institution', 'admin'), likePost);
route.delete('/posts/:postId/like', authMiddleware, authorizeRoles('public', 'institution', 'admin'), unlikePost);

route.post('/posts/:postId/comments', authMiddleware, authorizeRoles('public', 'institution', 'admin'), validateComment, addComment);
route.get('/posts/:postId/comments', getComments);
route.delete('/comments/:commentId', authMiddleware, authorizeRoles('public', 'institution', 'admin'), deleteComment);

route.get('/hashtags', getPopularHashtags);
route.get('/events/:eventId/posts', optionalAuth, getPostsByEvent);
route.get('/art-forms/:artFormId/posts', optionalAuth, getPostsByArtForm);

module.exports = route;
