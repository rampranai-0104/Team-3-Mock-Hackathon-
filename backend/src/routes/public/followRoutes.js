const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');

const {
    followArtist,
    unfollowArtist,
    checkFollowStatus,
    getMyFollowing
} = require('../../controllers/public/followController');

const route = express.Router();

route.post('/artists/:artistId/follow', authMiddleware, followArtist);
route.delete('/artists/:artistId/follow', authMiddleware, unfollowArtist);
route.get('/artists/:artistId/follow', authMiddleware, checkFollowStatus);
route.get('/following', authMiddleware, getMyFollowing);

module.exports = route;
