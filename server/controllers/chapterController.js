const { deleteFromCloudinary } = require("../middleware/upload");
const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const Exercise = require("../models/Exercise");
const Material = require("../models/Material");


// ---------------- CONTROLLERS ----------------

const addChapter = async (req, res) => {
  try {
    const { subjectId, chapterName } = req.body;

    // Check subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, msg: "Subject not found" });
    }

    // Prevent duplicate chapters in same subject
    const chapter = await Chapter.findOne({ subjectId, chapterName });
    if (chapter) {
      return res.status(409).json({
        success: false,
        msg: "Chapter already exists for this subject",
      });
    }

    const newChapter = new Chapter({ subjectId, chapterName });
    await newChapter.save();

    return res.status(201).json({
      success: true,
      msg: `Chapter "${chapterName}" created under subject: ${subject.name}`,
      chapter: newChapter,
    });
  } catch (error) {
    console.log("Add Chapter Error: ", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const getChapters = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, msg: "Subject not found" });
    }

    const chapters = await Chapter.find({ subjectId });

    return res.status(200).json({ success: true, chapters });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

const getChapter = async (req, res) => {
  const { id } = req.params;
  try {
    const chapter = await Chapter.findById(id);
    if (!chapter)
      return res.status(404).json({ success: false, msg: "Chapter not found" });

    return res.status(200).json({ success: true, chapter });
  } catch (error) {
    console.log("Get Chapter Error: ", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const updateChapter = async (req, res) => {
  const { id } = req.params;
  const { chapterName } = req.body;

  try {
    const chapter = await Chapter.findById(id);
    if (!chapter)
      return res.status(404).json({ success: false, msg: "Chapter not found" });

    // Update
    chapter.chapterName = chapterName;
    await chapter.save();

    return res.status(200).json({
      success: true,
      msg: `Chapter renamed to "${chapterName}"`,
      chapter,
    });
  } catch (error) {
    console.log("Update Chapter Error: ", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};


const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    const chapter = await Chapter.findById(id);
    if (!chapter) {
      return res.status(404).json({ success: false, msg: "Chapter not found" });
    }

    // --- Find exercises under this chapter ---
    const exercises = await Exercise.find({ chapterId: id });

    // --- Find all materials linked to this chapter OR its exercises ---
    const materials = await Material.find({
      $or: [
        { chapterId: id },
        { exerciseId: { $in: exercises.map((e) => e._id) } },
      ],
    });

    // --- Delete files from Cloudinary ---
    for (const material of materials) {
      if (material.type !== "text" && material.publicId) {
        const resourceType = material.type === "image" ? "image" : "raw";
        try {
          await deleteFromCloudinary(material.publicId, resourceType);
        } catch (err) {
          console.error(`Failed to delete material ${material._id} from Cloudinary:`, err.message);
        }
      }
    }

    // --- Delete materials from DB ---
    await Material.deleteMany({ _id: { $in: materials.map((m) => m._id) } });

    // --- Delete exercises ---
    await Exercise.deleteMany({ _id: { $in: exercises.map((e) => e._id) } });

    // --- Delete chapter ---
    await chapter.deleteOne();

    return res.status(200).json({
      success: true,
      msg: `Chapter "${chapter.chapterName}" and all its exercises/materials deleted`,
    });
  } catch (error) {
    console.error("Delete Chapter Error:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  addChapter,
  getChapters,
  getChapter,
  updateChapter,
  deleteChapter,
};
