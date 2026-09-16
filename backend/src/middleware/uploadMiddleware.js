const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP image formats are allowed'), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB per image
    },
    fileFilter
});

const singleUpload = (fieldname = 'image') => {
    return (req, res, next) => {
        upload.single(fieldname)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File size exceeds 5 MB limit'
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: `Upload error: ${err.message}`
                });
            } else if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
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
                    return res.status(400).json({
                        success: false,
                        message: 'One or more files exceed the 5 MB limit'
                    });
                }
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({
                        success: false,
                        message: `Too many files. Maximum allowed is ${maxCount} images`
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: `Upload error: ${err.message}`
                });
            } else if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    };
};

module.exports = {
    upload,
    singleUpload,
    multipleUpload,
    uploadPostImages: multipleUpload('images', 5)
};
