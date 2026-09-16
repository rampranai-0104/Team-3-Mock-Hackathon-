const LearningJourney = require("../../models/LearningJourney");

const getPublishedLearning = async (req, res) => {
    try {
        const { search, artForm, level } = req.query;
        let filter = { status: "published" };

        if (artForm) {
            filter.artFormId = artForm;
        }

        if (level) {
            filter.level = level.toLowerCase();
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const journeys = await LearningJourney.find(filter)
            .populate("artFormId", "name slug")
            .populate("artistIds", "displayName profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Learning journeys fetched successfully",
            data: journeys
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getLearningById = async (req, res) => {
    try {
        const { id } = req.params;

        let journey;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            journey = await LearningJourney.findOne({ _id: id, status: "published" });
        } else {
            journey = await LearningJourney.findOne({ slug: id.toLowerCase(), status: "published" });
        }

        if (!journey) {
            return res.status(404).json({
                success: false,
                message: "Learning journey not found"
            });
        }

        await journey.populate("artFormId", "name slug description media");
        await journey.populate("artistIds", "displayName bio profileImage location");

        res.status(200).json({
            success: true,
            message: "Learning journey details fetched successfully",
            data: journey
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
    getPublishedLearning,
    getLearningById
};
