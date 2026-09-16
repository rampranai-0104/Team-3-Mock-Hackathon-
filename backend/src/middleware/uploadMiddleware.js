const multer = require('multer');
const { sendError } = require('../utils/apiResponse');

// Memory storage keeps file buffers in memory for direct Cloudinary streaming
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed types are: JPEG, PNG, WEBP, GIF, MP4, WEBM, QuickTime.`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB limit
  },
  fileFilter
});

/**
 * Flexible upload handler that accepts 'media', 'file', or single uploaded file in multipart/form-data
 */
const handleUpload = (preferredFieldName = 'media') => {
  const multerUpload = upload.any();

  return (req, res, next) => {
    multerUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendError(res, 'File size exceeds the 15MB limit.', null, 400);
        }
        return sendError(res, `Upload error: ${err.message}`, null, 400);
      } else if (err) {
        return sendError(res, err.message, null, 400);
      }

      // If files were uploaded via any(), assign the target file to req.file
      if (req.files && req.files.length > 0) {
        const matchingFile = req.files.find(f => f.fieldname === preferredFieldName || f.fieldname === 'file' || f.fieldname === 'media');
        req.file = matchingFile || req.files[0];
      }

      next();
    });
  };
};

const singleUpload = (fieldname = 'image') => {
  return (req, res, next) => {
    upload.single(fieldname)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendError(res, 'File size exceeds limit.', null, 400);
        }
        return sendError(res, `Upload error: ${err.message}`, null, 400);
      } else if (err) {
        return sendError(res, err.message, null, 400);
      }
      next();
    });
  };
};

const multipleUpload = (fieldname = 'images', maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldname, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendError(res, 'One or more files exceed limit.', null, 400);
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return sendError(res, `Too many files. Maximum allowed is ${maxCount}`, null, 400);
        }
        return sendError(res, `Upload error: ${err.message}`, null, 400);
      } else if (err) {
        return sendError(res, err.message, null, 400);
      }
      next();
    });
  };
};

module.exports = {
  upload,
  handleUpload,
  singleUpload,
  multipleUpload,
  uploadPostImages: multipleUpload('images', 5)
};
