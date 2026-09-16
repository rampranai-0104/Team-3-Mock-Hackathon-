const ArtForm = require("../../models/ArtForm");
const Artist = require("../../models/Artist");

const getAllArtForms = async (req, res) => {
    try {
        const { search, region } = req.query;
        let filter = { status: "active" };

        if (region) {
            filter.regions = { $in: [new RegExp(region, "i")] };
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const artForms = await ArtForm.find(filter).sort({ name: 1 });

        res.status(200).json({
            success: true,
            message: "Art forms fetched successfully",
            data: artForms
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getArtFormById = async (req, res) => {
    try {
        const { id } = req.params;

        let artForm;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            artForm = await ArtForm.findOne({ _id: id, status: "active" });
        } else {
            artForm = await ArtForm.findOne({ slug: id.toLowerCase(), status: "active" });
        }

        if (!artForm) {
            return res.status(404).json({
                success: false,
                message: "Art form not found"
            });
        }

        const relatedArtists = await Artist.find({
            artFormIds: artForm._id,
            verificationStatus: "approved"
        }).select("displayName profileImage location languages experience availability");

        res.status(200).json({
            success: true,
            message: "Art form details fetched successfully",
            data: {
                ...artForm.toObject(),
                relatedArtists
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
    getAllArtForms,
    getArtFormById
};
