const Follow = require("../../models/Follow");
const Artist = require("../../models/Artist");

const followArtist = async (req, res) => {
    try {
        const { artistId } = req.params;
        const userId = req.user._id;

        const artist = await Artist.findOne({
            _id: artistId,
            verificationStatus: "approved"
        });

        if (!artist) {
            return res.status(404).json({
                success: false,
                message: "Artist not found"
            });
        }

        if (artist.userId.toString() === userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself"
            });
        }

        const existingFollow = await Follow.findOne({ userId, artistId });
        if (existingFollow) {
            return res.status(200).json({
                success: true,
                message: "Already following this artist"
            });
        }

        const follow = await Follow.create({ userId, artistId });

        res.status(201).json({
            success: true,
            message: "Successfully followed artist",
            data: follow
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const unfollowArtist = async (req, res) => {
    try {
        const { artistId } = req.params;
        const userId = req.user._id;

        const follow = await Follow.findOneAndDelete({ userId, artistId });
        if (!follow) {
            return res.status(404).json({
                success: false,
                message: "You are not following this artist"
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully unfollowed artist"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const checkFollowStatus = async (req, res) => {
    try {
        const { artistId } = req.params;
        const userId = req.user._id;

        const follow = await Follow.findOne({ userId, artistId });

        res.status(200).json({
            success: true,
            isFollowing: !!follow
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyFollowing = async (req, res) => {
    try {
        const follows = await Follow.find({ userId: req.user._id })
            .populate({
                path: "artistId",
                select: "displayName bio location profileImage availability",
                populate: { path: "artFormIds", select: "name slug" }
            })
            .sort({ createdAt: -1 });

        const artists = follows
            .filter((f) => f.artistId)
            .map((f) => ({
                ...f.artistId.toObject(),
                followedAt: f.createdAt
            }));

        res.status(200).json({
            success: true,
            message: "Followed artists fetched successfully",
            data: artists
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    followArtist,
    unfollowArtist,
    checkFollowStatus,
    getMyFollowing
};
