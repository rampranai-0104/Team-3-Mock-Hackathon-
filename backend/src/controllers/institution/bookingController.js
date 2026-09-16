const Booking = require("../../models/Booking");
const Event = require("../../models/Event");
const Institution = require("../../models/Institution");
const generateBookingCode = require("../../utils/generateBookingCode");

const createBooking = async (req, res) => {
    try {
        const { eventId, quantity = 1, notes } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (event.status !== "published") {
            return res.status(400).json({
                success: false,
                message: "Event is not open for bookings"
            });
        }

        const requestedSeats = parseInt(quantity, 10) || 1;
        if (event.availableSeats < requestedSeats) {
            return res.status(400).json({
                success: false,
                message: `Only ${event.availableSeats} seats available`
            });
        }

        let institutionId = null;
        const institution = await Institution.findOne({ userId: req.user._id });
        if (institution) {
            institutionId = institution._id;
        }

        const bookingCode = generateBookingCode();
        const totalAmount = event.price * requestedSeats;
        const primaryArtistId = (event.artistIds && event.artistIds.length > 0) ? event.artistIds[0] : null;

        const booking = await Booking.create({
            bookingCode,
            userId: req.user._id,
            institutionId,
            eventId: event._id,
            artistId: primaryArtistId,
            quantity: requestedSeats,
            amount: totalAmount,
            status: "confirmed",
            notes: notes || ""
        });

        // Decrement available seats and increment bookedCount
        event.availableSeats = Math.max(0, event.availableSeats - requestedSeats);
        event.bookedCount = (event.bookedCount || 0) + requestedSeats;
        await event.save();

        res.status(201).json({
            success: true,
            message: "Booking confirmed successfully",
            data: booking
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate("eventId", "title type date time location price image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
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

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate("eventId", "title type date time location price image description");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking details fetched successfully",
            data: booking
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        booking.status = "cancelled";
        await booking.save();

        // Restore event capacity
        const event = await Event.findById(booking.eventId);
        if (event) {
            event.availableSeats += booking.quantity;
            if (event.bookedCount) {
                event.bookedCount = Math.max(0, event.bookedCount - booking.quantity);
            }
            await event.save();
        }

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking
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
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking
};

