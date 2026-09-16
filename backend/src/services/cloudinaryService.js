const cloudinary = require('../config/cloudinary');

/**
 * Uploads a buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {Object} options - Upload options (folder, resource_type, etc.)
 * @returns {Promise<{ url: string, publicId: string, format: string, resourceType: string }>}
 */
const uploadToCloudinary = async (fileBuffer, options = {}) => {
  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  // If Cloudinary credentials are not set, provide a mock response for local testing
  if (!isCloudinaryConfigured) {
    const mockId = `local_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      url: `https://res.cloudinary.com/mock-cloud/image/upload/v1/${mockId}.jpg`,
      publicId: `tvarita/mock/${mockId}`,
      format: options.format || 'jpg',
      resourceType: options.resource_type || 'image'
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'tvarita/artists',
        resource_type: options.resource_type || 'auto',
        ...options
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          resourceType: result.resource_type
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an asset from Cloudinary by public ID
 * @param {string} publicId - The Cloudinary public ID
 * @param {string} resourceType - 'image' | 'video' | 'raw'
 * @returns {Promise<Object>}
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (!isCloudinaryConfigured || !publicId || publicId.startsWith('tvarita/mock/')) {
    return { result: 'ok' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Error deleting asset from Cloudinary:', error.message);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};
