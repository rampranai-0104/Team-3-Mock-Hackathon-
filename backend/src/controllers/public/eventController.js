const Event = require("../../models/Event");

const getUpcomingEvents = async (req, res) => {
    try {
        const { search, artForm, artist, type, city } = req.query;
        let filter = {
            status: "published",
            date: { $gte: new Date() }
        };

        if (artForm) {
            filter.artFormIds = artForm;
        }

        if (artist) {
            filter.artistIds = artist;
        }

        if (type) {
            filter.type = type.toLowerCase();
        }

        if (city) {
            filter["location.city"] = { $regex: city, $options: "i" };
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const events = await Event.find(filter)
            .populate("artFormIds", "name slug")
            .populate("artistIds", "displayName profileImage")
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            message: "Upcoming events fetched successfully",
            data: events
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await Event.findOne({
            _id: req.params.id,
            status: "published"
        })
            .populate("artFormIds", "name slug description media")
            .populate("artistIds", "displayName bio profileImage location");

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event details fetched successfully",
            data: event
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
    getUpcomingEvents,
    getEventById
};
