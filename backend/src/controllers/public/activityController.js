const Follow = require("../../models/Follow");

const getMyActivity = async (req, res) => {
    try {
        const userId = req.user._id;

        const follows = await Follow.find({ userId })
            .populate("artistId", "displayName profileImage location")
            .sort({ createdAt: -1 })
            .limit(10);

        const followedArtistsCount = await Follow.countDocuments({ userId });

        res.status(200).json({
            success: true,
            message: "User activity fetched successfully",
            data: {
                user: {
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                    avatar: req.user.avatar
                },
                stats: {
                    followedArtistsCount
                },
                recentActivity: {
                    followedArtists: follows
                        .filter((f) => f.artistId)
                        .map((f) => ({
                            type: "FOLLOW_ARTIST",
                            artist: f.artistId,
                            date: f.createdAt
                        }))
                }
            }
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
    getMyActivity
};
