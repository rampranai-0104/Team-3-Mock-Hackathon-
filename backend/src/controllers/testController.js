const { uploadToCloudinary } = require('../services/cloudinaryService');

const testUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an image file with field name "image"'
            });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'tvarita/test');

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: result.url,
                publicId: result.publicId
            }
        });
    } catch (error) {
        console.error('Test upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Image upload failed'
        });
    }
};

module.exports = {
    testUpload
};

