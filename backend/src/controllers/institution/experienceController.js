const Event = require("../../models/Event");

const getExperiences = async (req, res) => {
    try {
        const { search, artForm, type } = req.query;

        let filter = {
            status: "published",
            type: { $in: ["workshop", "performance", "masterclass", "learning"] }
        };

        if (type) {
            filter.type = type.toLowerCase();
        }

        if (artForm) {
            filter.artFormIds = artForm;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const experiences = await Event.find(filter)
            .populate("artFormIds", "name slug regions")
            .populate("artistIds", "displayName profileImage location")
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            message: "Curated experiences fetched successfully",
            data: experiences
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getExperienceById = async (req, res) => {
    try {
        const experience = await Event.findOne({
            _id: req.params.id,
            status: "published"
        })
            .populate("artFormIds", "name slug description media")
            .populate("artistIds", "displayName bio profileImage location");

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Experience details fetched successfully",
            data: experience
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
    getExperiences,
    getExperienceById
};

