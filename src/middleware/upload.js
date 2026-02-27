const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for local uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Store files in the 'uploads' directory at the project root
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename using timestamp and a random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to allow only image types
const fileFilter = (req, file, cb) => {
    const allowedMimetypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimetypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, png, webp) are allowed!'), false);
    }
};

// Create the multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;
