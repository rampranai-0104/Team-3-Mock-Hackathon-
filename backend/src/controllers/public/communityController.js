const communityService = require('../../services/communityService');

const createPost = async (req, res) => {
    try {
        const { caption, hashtags, event, artForm, visibility } = req.body;
        const post = await communityService.createPost({
            authorId: req.user._id,
            authorType: req.user.role === 'institution' ? 'institution' : 'public',
            caption,
            hashtags,
            event,
            artForm,
            files: req.files,
            visibility
        });

        res.status(201).json({
            success: true,
            message: 'Community post created successfully',
            data: post
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getFeed = async (req, res) => {
    try {
        const { page, limit, event, artForm, hashtag } = req.query;
        const currentUserId = req.user ? req.user._id : null;

        const result = await communityService.getFeed({
            page,
            limit,
            event,
            artForm,
            hashtag,
            currentUserId
        });

        res.status(200).json({
            success: true,
            message: 'Community feed fetched successfully',
            data: result.posts,
            pagination: result.pagination
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getPostById = async (req, res) => {
    try {
        const currentUserId = req.user ? req.user._id : null;
        const post = await communityService.getPostById(req.params.postId, currentUserId);

        res.status(200).json({
            success: true,
            message: 'Community post fetched successfully',
            data: post
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updatePost = async (req, res) => {
    try {
        const { caption, hashtags, event, artForm } = req.body;
        const updatedPost = await communityService.updatePost({
            postId: req.params.postId,
            userId: req.user._id,
            caption,
            hashtags,
            event,
            artForm
        });

        res.status(200).json({
            success: true,
            message: 'Community post updated successfully',
            data: updatedPost
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const result = await communityService.deletePost({
            postId: req.params.postId,
            userId: req.user._id
        });

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const likePost = async (req, res) => {
    try {
        const result = await communityService.likePost({
            postId: req.params.postId,
            userId: req.user._id
        });

        res.status(200).json({
            success: true,
            message: result.message,
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const unlikePost = async (req, res) => {
    try {
        const result = await communityService.unlikePost({
            postId: req.params.postId,
            userId: req.user._id
        });

        res.status(200).json({
            success: true,
            message: result.message,
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await communityService.addComment({
            postId: req.params.postId,
            userId: req.user._id,
            text
        });

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: comment
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getComments = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await communityService.getComments({
            postId: req.params.postId,
            page,
            limit
        });

        res.status(200).json({
            success: true,
            message: 'Comments fetched successfully',
            data: result.comments,
            pagination: result.pagination
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const result = await communityService.deleteComment({
            commentId: req.params.commentId,
            userId: req.user._id
        });

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getPopularHashtags = async (req, res) => {
    try {
        const { limit } = req.query;
        const hashtags = await communityService.getPopularHashtags(limit);

        res.status(200).json({
            success: true,
            message: 'Popular hashtags fetched successfully',
            data: hashtags
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getPostsByEvent = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const currentUserId = req.user ? req.user._id : null;
        const result = await communityService.getPostsByEvent({
            eventId: req.params.eventId,
            page,
            limit,
            currentUserId
        });

        res.status(200).json({
            success: true,
            message: 'Event community posts fetched successfully',
            data: result.posts,
            pagination: result.pagination
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getPostsByArtForm = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const currentUserId = req.user ? req.user._id : null;
        const result = await communityService.getPostsByArtForm({
            artFormId: req.params.artFormId,
            page,
            limit,
            currentUserId
        });

        res.status(200).json({
            success: true,
            message: 'Art form community posts fetched successfully',
            data: result.posts,
            pagination: result.pagination
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
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
};
