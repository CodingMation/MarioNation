// middleware/upload.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Allowed file types
const allowedTypes = /pdf|docx|doc|jpg|jpeg|png|mp4|mp3|pptx/;

const allowedMimes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "video/mp4",
  "audio/mpeg",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

const fileFilter = (req, file, cb) => {
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimes.includes(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed: pdf, docx, doc, jpg, jpeg, png, mp4, mp3, pptx"));
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      let uploadPath = path.join("uploads", "materials");
      fs.mkdirSync(uploadPath, { recursive: true }); // create folder if not exists
      cb(null, uploadPath);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    cb(null, 'MarioNation-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
});

// Export ready-to-use functions
module.exports = {
  upload,                               // raw multer instance
  uploadSingle: upload.single("file"),  // for single file field named "file"
  uploadMultiple: upload.array("files", 5), // for multiple files, max 5
};