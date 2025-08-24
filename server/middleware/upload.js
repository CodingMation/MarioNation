const multer = require("multer");
const path = require("path");
const cloudinary = require("../middleware/cloudinary");

// Allowed file types
const allowedTypes = /pdf|docx|doc|jpg|jpeg|png|mp4|mp3|pptx/;

const fileFilter = (req, file, cb) => {
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (extname) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Allowed: pdf, docx, doc, jpg, jpeg, png, mp4, mp3, pptx"
      )
    );
  }
};

// Memory storage (file in buffer)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

// Upload buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder, publicId) => {
  const uploadDate = new Date().toISOString();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result); // result.resource_type will be "image" | "file" | "raw"
      }
    );
    stream.end(fileBuffer);
  });
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return result;
  } catch (error) {
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
};

module.exports = {
  upload,
  uploadSingle: upload.single("file"),
  uploadMultiple: upload.array("files", 5),
  uploadToCloudinary,
  deleteFromCloudinary,
};