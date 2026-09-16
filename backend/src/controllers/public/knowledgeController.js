const KnowledgeItem = require("../../models/KnowledgeItem");

const getPublishedKnowledge = async (req, res) => {
    try {
        const { search, artForm, type, language } = req.query;
        let filter = { status: "published" };

        if (artForm) {
            filter.artFormId = artForm;
        }

        if (type) {
            filter.type = type.toLowerCase();
        }

        if (language) {
            filter.language = { $regex: language, $options: "i" };
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { summary: { $regex: search, $options: "i" } }
            ];
        }

        const items = await KnowledgeItem.find(filter)
            .populate("artFormId", "name slug")
            .populate("artistIds", "displayName profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Knowledge items fetched successfully",
            data: items
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getKnowledgeById = async (req, res) => {
    try {
        const { id } = req.params;

        let item;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            item = await KnowledgeItem.findOne({ _id: id, status: "published" });
        } else {
            item = await KnowledgeItem.findOne({ slug: id.toLowerCase(), status: "published" });
        }

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Knowledge item not found"
            });
        }

        await item.populate("artFormId", "name slug description media");
        await item.populate("artistIds", "displayName bio profileImage location");

        res.status(200).json({
            success: true,
            message: "Knowledge item details fetched successfully",
            data: item
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
    getPublishedKnowledge,
    getKnowledgeById
};
