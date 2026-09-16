const Request = require("../../models/Request");
const Institution = require("../../models/Institution");

const createRequest = async (req, res) => {
    try {
        const {
            title,
            eventType,
            artistId,
            artFormId,
            groupSize,
            preferredDate,
            alternateDate,
            budget,
            location,
            message
        } = req.body;

        let institutionId = null;
        const institution = await Institution.findOne({ userId: req.user._id });
        if (institution) {
            institutionId = institution._id;
        }

        const mongoose = require('mongoose');
        const validArtistId = (artistId && mongoose.Types.ObjectId.isValid(artistId)) ? artistId : null;
        const validArtFormId = (artFormId && mongoose.Types.ObjectId.isValid(artFormId)) ? artFormId : null;
        const validPreferredDate = preferredDate && !isNaN(new Date(preferredDate).getTime()) 
            ? new Date(preferredDate) 
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const newRequest = await Request.create({
            requesterId: req.user._id,
            requesterType: req.user.role === "institution" ? "institution" : "individual",
            institutionId,
            artistId: validArtistId,
            artFormId: validArtFormId,
            title: title || "Artisan Workshop Requisition",
            eventType: eventType || "workshop",
            groupSize: groupSize || 20,
            preferredDate: validPreferredDate,
            alternateDate: alternateDate && !isNaN(new Date(alternateDate).getTime()) ? new Date(alternateDate) : undefined,
            budget: budget || 0,
            location: location || {},
            message: message || "",
            status: "pending"
        });

        res.status(201).json({
            success: true,
            message: "Request submitted successfully",
            data: newRequest
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ requesterId: req.user._id })
            .populate("artistId", "displayName profileImage location")
            .populate("artFormId", "name slug")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Requests fetched successfully",
            data: requests
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getRequestById = async (req, res) => {
    try {
        const request = await Request.findOne({
            _id: req.params.id,
            requesterId: req.user._id
        })
            .populate("artistId", "displayName bio profileImage location")
            .populate("artFormId", "name slug description");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Request details fetched successfully",
            data: request
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateRequest = async (req, res) => {
    try {
        const request = await Request.findOne({
            _id: req.params.id,
            requesterId: req.user._id
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending requests can be updated"
            });
        }

        const allowedUpdates = [
            "title",
            "groupSize",
            "preferredDate",
            "alternateDate",
            "budget",
            "location",
            "message"
        ];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                request[field] = req.body[field];
            }
        });

        await request.save();

        res.status(200).json({
            success: true,
            message: "Request updated successfully",
            data: request
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const cancelRequest = async (req, res) => {
    try {
        const request = await Request.findOne({
            _id: req.params.id,
            requesterId: req.user._id
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        if (request.status === "cancelled" || request.status === "completed") {
            return res.status(400).json({
                success: false,
                message: `Request is already ${request.status}`
            });
        }

        request.status = "cancelled";
        request.cancellationReason = req.body.reason || "Cancelled by requester";
        await request.save();

        res.status(200).json({
            success: true,
            message: "Request cancelled successfully",
            data: request
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
    createRequest,
    getMyRequests,
    getRequestById,
    updateRequest,
    cancelRequest
};

