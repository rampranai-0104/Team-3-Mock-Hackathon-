const Institution = require("../../models/Institution");
const Booking = require("../../models/Booking");
const Order = require("../../models/Order");

const getMyInstitutionProfile = async (req, res) => {
    try {
        const institution = await Institution.findOne({ userId: req.user._id })
            .populate("preferredArtForms", "name slug regions");

        if (!institution) {
            return res.status(404).json({
                success: false,
                message: "Institution profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Institution profile fetched successfully",
            data: institution
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateMyInstitutionProfile = async (req, res) => {
    try {
        const {
            organizationName,
            type,
            contactPerson,
            address,
            website,
            preferredArtForms
        } = req.body;

        let institution = await Institution.findOne({ userId: req.user._id });

        if (!institution) {
            institution = await Institution.create({
                userId: req.user._id,
                organizationName: organizationName || req.user.name,
                type: type || "school",
                contactPerson: contactPerson || { name: req.user.name, email: req.user.email },
                address: address || {},
                website: website || "",
                preferredArtForms: preferredArtForms || []
            });
        } else {
            if (organizationName) institution.organizationName = organizationName;
            if (type) institution.type = type;
            if (contactPerson) institution.contactPerson = { ...institution.contactPerson, ...contactPerson };
            if (address) institution.address = { ...institution.address, ...address };
            if (website !== undefined) institution.website = website;
            if (preferredArtForms) institution.preferredArtForms = preferredArtForms;

            await institution.save();
        }

        res.status(200).json({
            success: true,
            message: "Institution profile updated successfully",
            data: institution
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getInstitutionBookings = async (req, res) => {
    try {
        const institution = await Institution.findOne({ userId: req.user._id });

        const query = institution
            ? { $or: [{ institutionId: institution._id }, { userId: req.user._id }] }
            : { userId: req.user._id };

        const bookings = await Booking.find(query)
            .populate("eventId", "title type date time location price image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Institution bookings fetched successfully",
            data: bookings
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getInstitutionOrders = async (req, res) => {
    try {
        const institution = await Institution.findOne({ userId: req.user._id });

        const query = institution
            ? { $or: [{ institutionId: institution._id }, { buyerId: req.user._id }] }
            : { buyerId: req.user._id };

        const orders = await Order.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Institution orders fetched successfully",
            data: orders
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
    getMyInstitutionProfile,
    updateMyInstitutionProfile,
    getInstitutionBookings,
    getInstitutionOrders
};

