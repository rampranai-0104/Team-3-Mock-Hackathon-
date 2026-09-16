const cloudinary = require('../config/cloudinary');

/**
 * Uploads a buffer to Cloudinary with fallback support for local testing
 * @param {Buffer} buffer - The file buffer from multer
 * @param {Object|string} options - Upload options object or folder name string
 * @returns {Promise<{ url: string, publicId: string, format?: string, resourceType?: string }>}
 */
const uploadToCloudinary = async (buffer, options = {}) => {
  if (!buffer) {
    throw new Error('No file buffer provided for upload');
  }

  const uploadOptions = typeof options === 'string'
    ? { folder: options, resource_type: 'auto' }
    : { folder: 'tvarita/general', resource_type: 'auto', ...options };

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
      publicId: `${uploadOptions.folder || 'tvarita/mock'}/${mockId}`,
      format: uploadOptions.format || 'jpg',
      resourceType: uploadOptions.resource_type || 'image'
    };
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          resourceType: result.resource_type
        });
      }
    );

    stream.end(buffer);
  });
};

/**
 * Deletes an asset from Cloudinary by public ID
 * @param {string} publicId - The Cloudinary public ID
 * @param {string} resourceType - 'image' | 'video' | 'raw'
 * @returns {Promise<Object|boolean>}
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return false;

  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (!isCloudinaryConfigured || publicId.includes('mock')) {
    return { result: 'ok' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result.result === 'ok' || result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error.message);
    return false;
  }
};

/**
 * Upload multiple files to Cloudinary
 */
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
