const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer, folder = 'tvarita/general') => {
    return new Promise((resolve, reject) => {
        if (!buffer) {
            return reject(new Error('No image buffer provided for upload'));
        }

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    return reject(new Error(`Cloudinary upload failed: ${error.message}`));
                }
                resolve({
                    url: result.secure_url || result.url,
                    publicId: result.public_id
                });
            }
        );

        stream.end(buffer);
    });
};

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return false;
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
    } catch (error) {
        console.error('Cloudinary deletion error:', error.message);
        return false;
    }
};

const uploadMultipleToCloudinary = async (files = [], folder = 'tvarita/community') => {
    if (!files || !files.length) return [];
    const uploadPromises = files.map((file) =>
        uploadToCloudinary(file.buffer, folder)
    );
    return await Promise.all(uploadPromises);
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
    uploadMultipleToCloudinary,
    // Aliases for seamless compatibility across features
    uploadImageBuffer: uploadToCloudinary,
    uploadMultipleImages: uploadMultipleToCloudinary,
    deleteImage: deleteFromCloudinary
};
