const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const Exercise = require("../models/Exercise");
const Material = require("../models/Material");

const { deleteFromCloudinary } = require("../middleware/upload");
// ---------------- CONTROLLERS ----------------

const addExercise = async (req, res) => {
  try {
    const { chapterId, exerciseName } = req.body;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, msg: "Chapter not found" });
    }

    const existingExercise = await Exercise.findOne({
      chapterId,
      exerciseName,
    });
    if (existingExercise) {
      return res.status(409).json({
        success: false,
        msg: "Exercise already exists for this chapter",
      });
    }

    const newExercise = new Exercise({ chapterId, exerciseName });
    await newExercise.save();

    return res.status(201).json({
      success: true,
      msg: `Chapter: ${chapter.chapterName} -> Exercise "${exerciseName}" is created`,
    });
  } catch (error) {
    console.log("Add Exercise:", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const getExercises = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, msg: "Chapter not found" });
    }

    const exercises = await Exercise.find({ chapterId });
    return res.status(200).json({ success: true, exercises });
  } catch (error) {
    console.log("Get Exercises:", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const getExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res
        .status(404)
        .json({ success: false, msg: "Exercise not found" });
    }

    return res.status(200).json({ success: true, exercise });
  } catch (error) {
    console.log("Get Exercise:", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { exerciseName } = req.body;

    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res
        .status(404)
        .json({ success: false, msg: "Exercise not found" });
    }

    // Update DB
    exercise.exerciseName = exerciseName;
    await exercise.save();

    return res.status(200).json({
      success: true,
      msg: `Exercise renamed to "${exerciseName}"`,
    });
  } catch (error) {
    console.log("Update Exercise:", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res.status(404).json({ success: false, msg: "Exercise not found" });
    }

    const materials = await Material.find({ exerciseId: id });

    // --- delete files from Cloudinary for each material ---
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

    // --- delete materials from DB ---
    await Material.deleteMany({ exerciseId: id });

    // --- delete exercise ---
    await exercise.deleteOne();

    return res.status(200).json({
      success: true,
      msg: `Exercise "${exercise.exerciseName}" and its materials deleted`,
    });
  } catch (error) {
    console.log("Delete Exercise:", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  addExercise,
  getExercises,
  getExercise,
  updateExercise,
  deleteExercise,
};