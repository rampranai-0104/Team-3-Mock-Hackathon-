const Artist = require("../../models/Artist");
const Event = require("../../models/Event");
const Product = require("../../models/Product");

const getApprovedArtists = async (req, res) => {
    try {
        const { search, artForm, region, language, availability } = req.query;
        let filter = { verificationStatus: "approved" };

        if (artForm) {
            filter.artFormIds = artForm;
        }

        if (region) {
            filter.$or = [
                { "location.state": { $regex: region, $options: "i" } },
                { "location.city": { $regex: region, $options: "i" } }
            ];
        }

        if (language) {
            filter.languages = { $in: [new RegExp(language, "i")] };
        }

        if (availability !== undefined) {
            filter.availability = availability === "true";
        }

        if (search) {
            filter.displayName = { $regex: search, $options: "i" };
        }

        const artists = await Artist.find(filter)
            .populate("artFormIds", "name slug")
            .sort({ displayName: 1 });

        res.status(200).json({
            success: true,
            message: "Artists fetched successfully",
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

const getArtistById = async (req, res) => {
    try {
        const artist = await Artist.findOne({
            _id: req.params.id,
            verificationStatus: "approved"
        }).populate("artFormIds", "name slug description media");

        if (!artist) {
            return res.status(404).json({
                success: false,
                message: "Artist not found"
            });
        }

        const upcomingEvents = await Event.find({
            artistIds: artist._id,
            status: "published"
        }).sort({ date: 1 }).limit(5);

        const products = await Product.find({
            artistId: artist._id,
            status: "approved"
        }).limit(6);

        res.status(200).json({
            success: true,
            message: "Artist details fetched successfully",
            data: {
                ...artist.toObject(),
                upcomingEvents,
                products
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
    getApprovedArtists,
    getArtistById
};
