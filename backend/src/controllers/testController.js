const { uploadToCloudinary } = require('../services/cloudinaryService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const testUpload = async (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, 'Please provide an image file with field name "image"', null, 400);
        }

        const result = await uploadToCloudinary(req.file.buffer, 'tvarita/test');

        return sendSuccess(res, 'Image uploaded successfully', {
            url: result.url,
            publicId: result.publicId
        }, 200);
    } catch (error) {
        console.error('Test upload error:', error);
        return sendError(res, error.message || 'Image upload failed', null, 500);
    }
};

module.exports = {
    testUpload
};

