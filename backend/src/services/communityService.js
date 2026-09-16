const CommunityPost = require('../models/CommunityPost');
const PostLike = require('../models/PostLike');
const Comment = require('../models/Comment');
const Event = require('../models/Event');
const ArtForm = require('../models/ArtForm');
const cloudinaryService = require('./cloudinaryService');

const normalizeHashtags = (rawTags, caption = '') => {
    let tagsArray = [];
    if (Array.isArray(rawTags)) {
        tagsArray = [...rawTags];
    } else if (typeof rawTags === 'string') {
        try {
            const parsed = JSON.parse(rawTags);
            if (Array.isArray(parsed)) tagsArray = parsed;
            else tagsArray = rawTags.split(/[,\s]+/);
        } catch {
            tagsArray = rawTags.split(/[,\s]+/);
        }
    }

    if (caption) {
        const extracted = caption.match(/#[a-zA-Z0-9_]+/g) || [];
        tagsArray.push(...extracted);
    }

    const cleaned = tagsArray
        .map((t) => (typeof t === 'string' ? t.trim().toLowerCase() : ''))
        .filter((t) => t.length > 0)
        .map((t) => (t.startsWith('#') ? t : `#${t}`));

    return [...new Set(cleaned)];
};

const createPost = async ({
    authorId,
    authorType = 'public',
    caption,
    hashtags,
    event,
    artForm,
    files = [],
    visibility = 'public'
}) => {
    if (event) {
        const existingEvent = await Event.findById(event);
        if (!existingEvent) {
            const error = new Error('Event not found');
            error.statusCode = 404;
            throw error;
        }
    }

    if (artForm) {
        const existingArtForm = await ArtForm.findById(artForm);
        if (!existingArtForm) {
            const error = new Error('Art form not found');
            error.statusCode = 404;
            throw error;
        }
    }

    let uploadedImages = [];
    if (files && files.length > 0) {
        uploadedImages = await cloudinaryService.uploadMultipleImages(files, 'tvarita/community');
    }

    const normalizedTags = normalizeHashtags(hashtags, caption);

    let post;
    try {
        post = await CommunityPost.create({
            author: authorId,
            authorType,
            caption,
            images: uploadedImages,
            hashtags: normalizedTags,
            event: event || null,
            artForm: artForm || null,
            visibility,
            status: 'published'
        });
    } catch (saveError) {
        if (uploadedImages.length > 0) {
            for (const img of uploadedImages) {
                if (img.publicId) {
                    try {
                        await cloudinaryService.deleteFromCloudinary(img.publicId);
                    } catch (cloudErr) {
                        console.error(`Failed to roll back Cloudinary asset ${img.publicId}:`, cloudErr.message);
                    }
                }
            }
        }
        throw saveError;
    }

    return await CommunityPost.findById(post._id)
        .populate('author', 'name avatar role')
        .populate('event', 'title type date location')
        .populate('artForm', 'name slug regions');
};

const getFeed = async ({
    page = 1,
    limit = 10,
    event,
    artForm,
    hashtag,
    currentUserId
}) => {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, Math.min(50, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * pageSize;

    const filter = {
        status: 'published',
        visibility: 'public'
    };

    if (event) {
        filter.event = event;
    }

    if (artForm) {
        filter.artForm = artForm;
    }

    if (hashtag) {
        const normalizedTag = hashtag.trim().toLowerCase().startsWith('#')
            ? hashtag.trim().toLowerCase()
            : `#${hashtag.trim().toLowerCase()}`;
        filter.hashtags = normalizedTag;
    }

    const total = await CommunityPost.countDocuments(filter);
    const posts = await CommunityPost.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('author', 'name avatar role')
        .populate('event', 'title type date location')
        .populate('artForm', 'name slug regions')
        .lean();

    let userLikedPostIds = new Set();
    if (currentUserId && posts.length > 0) {
        const postIds = posts.map((p) => p._id);
        const likes = await PostLike.find({
            post: { $in: postIds },
            user: currentUserId
        }).select('post');
        userLikedPostIds = new Set(likes.map((l) => l.post.toString()));
    }

    const formattedPosts = posts.map((post) => ({
        ...post,
        isLikedByMe: userLikedPostIds.has(post._id.toString())
    }));

    return {
        posts: formattedPosts,
        pagination: {
            page: pageNumber,
            limit: pageSize,
            total,
            totalPages: Math.ceil(total / pageSize) || 1
        }
    };
};

const getPostById = async (postId, currentUserId) => {
    const post = await CommunityPost.findOne({
        _id: postId,
        status: 'published'
    })
        .populate('author', 'name avatar role')
        .populate('event', 'title type date location')
        .populate('artForm', 'name slug regions')
        .lean();

    if (!post) {
        const error = new Error('Community post not found');
        error.statusCode = 404;
        throw error;
    }

    let isLikedByMe = false;
    if (currentUserId) {
        const like = await PostLike.findOne({ post: postId, user: currentUserId });
        isLikedByMe = Boolean(like);
    }

    return {
        ...post,
        isLikedByMe
    };
};

const updatePost = async ({ postId, userId, caption, hashtags, event, artForm, files = [] }) => {
    const post = await CommunityPost.findById(postId);
    if (!post) {
        const error = new Error('Community post not found');
        error.statusCode = 404;
        throw error;
    }

    if (post.author.toString() !== userId.toString()) {
        const error = new Error('You are not authorized to modify this post');
        error.statusCode = 403;
        throw error;
    }

    let newImages = null;
    if (files && files.length > 0) {
        newImages = await cloudinaryService.uploadMultipleImages(files, 'tvarita/community');
    }

    const oldImages = post.images;
    if (newImages) {
        post.images = newImages;
    }

    if (event !== undefined) {
        if (event) {
            const existingEvent = await Event.findById(event);
            if (!existingEvent) {
                const error = new Error('Event not found');
                error.statusCode = 404;
                throw error;
            }
            post.event = event;
        } else {
            post.event = null;
        }
    }

    if (artForm !== undefined) {
        if (artForm) {
            const existingArtForm = await ArtForm.findById(artForm);
            if (!existingArtForm) {
                const error = new Error('Art form not found');
                error.statusCode = 404;
                throw error;
            }
            post.artForm = artForm;
        } else {
            post.artForm = null;
        }
    }

    if (caption !== undefined) {
        post.caption = caption;
    }

    if (hashtags !== undefined) {
        post.hashtags = normalizeHashtags(hashtags, post.caption);
    }

    try {
        await post.save();
    } catch (saveError) {
        if (newImages) {
            for (const img of newImages) {
                if (img.publicId) {
                    try {
                        await cloudinaryService.deleteFromCloudinary(img.publicId);
                    } catch (cloudErr) {
                        console.error(`Failed to roll back Cloudinary asset ${img.publicId}:`, cloudErr.message);
                    }
                }
            }
        }
        throw saveError;
    }

    if (newImages && oldImages && oldImages.length > 0) {
        for (const img of oldImages) {
            if (img.publicId) {
                try {
                    await cloudinaryService.deleteFromCloudinary(img.publicId);
                } catch (cloudErr) {
                    console.error(`Failed to delete old Cloudinary asset ${img.publicId}:`, cloudErr.message);
                }
            }
        }
    }

    return await CommunityPost.findById(post._id)
        .populate('author', 'name avatar role')
        .populate('event', 'title type date location')
        .populate('artForm', 'name slug regions');
};

const deletePost = async ({ postId, userId }) => {
    const post = await CommunityPost.findById(postId);
    if (!post) {
        const error = new Error('Community post not found');
        error.statusCode = 404;
        throw error;
    }

    if (post.author.toString() !== userId.toString()) {
        const error = new Error('You are not authorized to delete this post');
        error.statusCode = 403;
        throw error;
    }

    if (post.images && post.images.length > 0) {
        for (const img of post.images) {
            if (img.publicId) {
                try {
                    await cloudinaryService.deleteFromCloudinary(img.publicId);
                } catch (cloudErr) {
                    console.error(`Failed to delete Cloudinary asset ${img.publicId}:`, cloudErr.message);
                }
            }
        }
    }

    try {
        await PostLike.deleteMany({ post: postId });
        await Comment.deleteMany({ post: postId });
        await CommunityPost.findByIdAndDelete(postId);
    } catch (dbErr) {
        console.error(`Database deletion error for post ${postId}:`, dbErr.message);
        const error = new Error('Failed to delete post records from database');
        error.statusCode = 500;
        throw error;
    }

    return { message: 'Community post deleted successfully' };
};

const likePost = async ({ postId, userId }) => {
    const post = await CommunityPost.findById(postId);
    if (!post) {
        const error = new Error('Community post not found');
        error.statusCode = 404;
        throw error;
    }

    const existingLike = await PostLike.findOne({ post: postId, user: userId });
    if (existingLike) {
        return {
            liked: true,
            likesCount: post.likesCount,
            message: 'Post already liked'
        };
    }

    try {
        await PostLike.create({ post: postId, user: userId });
        const updatedPost = await CommunityPost.findByIdAndUpdate(
            postId,
            { $inc: { likesCount: 1 } },
            { new: true }
        );
        return {
            liked: true,
            likesCount: updatedPost.likesCount,
            message: 'Post liked successfully'
        };
    } catch (err) {
        if (err.code === 11000) {
            return {
                liked: true,
                likesCount: post.likesCount,
                message: 'Post already liked'
            };
        }
        throw err;
    }
};

const unlikePost = async ({ postId, userId }) => {
    const post = await CommunityPost.findById(postId);
    if (!post) {
        const error = new Error('Community post not found');
        error.statusCode = 404;
        throw error;
    }

    const existingLike = await PostLike.findOneAndDelete({ post: postId, user: userId });
    if (existingLike) {
        const newCount = Math.max(0, post.likesCount - 1);
        await CommunityPost.findByIdAndUpdate(postId, { likesCount: newCount });
        return {
            liked: false,
            likesCount: newCount,
            message: 'Post unliked successfully'
        };
    }

    return {
        liked: false,
        likesCount: post.likesCount,
        message: 'Post was not liked'
    };
};

const addComment = async ({ postId, userId, text }) => {
    const post = await CommunityPost.findById(postId);
    if (!post) {
        const error = new Error('Community post not found');
        error.statusCode = 404;
        throw error;
    }

    const comment = await Comment.create({
        post: postId,
        user: userId,
        text
    });

    await CommunityPost.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    return await Comment.findById(comment._id).populate('user', 'name avatar role');
};

const getComments = async ({ postId, page = 1, limit = 20 }) => {
    const post = await CommunityPost.findById(postId);
    if (!post) {
        const error = new Error('Community post not found');
        error.statusCode = 404;
        throw error;
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Comment.countDocuments({ post: postId });
    const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('user', 'name avatar role');

    return {
        comments,
        pagination: {
            page: pageNumber,
            limit: pageSize,
            total,
            totalPages: Math.ceil(total / pageSize) || 1
        }
    };
};

const deleteComment = async ({ commentId, userId }) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        const error = new Error('Comment not found');
        error.statusCode = 404;
        throw error;
    }

    if (comment.user.toString() !== userId.toString()) {
        const error = new Error('You are not authorized to delete this comment');
        error.statusCode = 403;
        throw error;
    }

    await Comment.findByIdAndDelete(commentId);
    const post = await CommunityPost.findById(comment.post);
    if (post) {
        const newCount = Math.max(0, post.commentsCount - 1);
        await CommunityPost.findByIdAndUpdate(comment.post, { commentsCount: newCount });
    }

    return { message: 'Comment deleted successfully' };
};

const getPopularHashtags = async (limit = 20) => {
    const limitNumber = Math.max(1, Math.min(50, parseInt(limit, 10) || 20));
    const hashtags = await CommunityPost.aggregate([
        { $match: { status: 'published', visibility: 'public' } },
        { $unwind: '$hashtags' },
        { $group: { _id: '$hashtags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limitNumber },
        { $project: { hashtag: '$_id', count: 1, _id: 0 } }
    ]);
    return hashtags;
};

const getPostsByEvent = async ({ eventId, page, limit, currentUserId }) => {
    const event = await Event.findById(eventId);
    if (!event) {
        const error = new Error('Event not found');
        error.statusCode = 404;
        throw error;
    }
    return await getFeed({ page, limit, event: eventId, currentUserId });
};

const getPostsByArtForm = async ({ artFormId, page, limit, currentUserId }) => {
    const artForm = await ArtForm.findById(artFormId);
    if (!artForm) {
        const error = new Error('Art form not found');
        error.statusCode = 404;
        throw error;
    }
    return await getFeed({ page, limit, artForm: artFormId, currentUserId });
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
    getPostsByArtForm,
    normalizeHashtags
};
