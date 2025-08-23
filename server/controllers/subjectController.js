const fs = require("fs");
const path = require("path");

const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const Exercise = require("../models/Exercise");
const Material = require("../models/Material");

// ---------------- CONTROLLERS ----------------

const addSubject = async (req, res) => {
  try {
    const { subjectName } = req.body;
    const subject = await Subject.findOne({ name: subjectName });
    if (subject) {
      return res
        .status(409)
        .json({ success: false, msg: "Subject already exists" });
    }

    const newSubject = new Subject({ name: subjectName });
    await newSubject.save();

    return res
      .status(201)
      .json({ success: true, msg: `Subject: "${subjectName}" Created` });
  } catch (error) {
    console.log("Add Subject: ", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    return res.status(200).json({ success: true, subjects });
  } catch (error) {
    console.log("Get Subjects: ", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const getSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ success: false, msg: "Subject not found" });
    }
    return res.status(200).json({ success: true, subject });
  } catch (error) {
    console.log("Get Subject: ", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectName } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ success: false, msg: "Subject not found" });
    }

    subject.name = subjectName;
    await subject.save();

    return res
      .status(200)
      .json({ success: true, msg: `Subject renamed to "${subjectName}"` });
  } catch (error) {
    console.log("Update Subject: ", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({ success: false, msg: "Subject not found" });
    }
    // --- Get all chapters of the subject ---
    const chapters = await Chapter.find({ subjectId: id });
    const exercises = await Exercise.find({
      chapterId: { $in: chapters.map((c) => c._id) },
    });
    const materials = await Material.find({ subjectId: id });

    // --- Delete files from uploads/materials ---
    for (const material of materials) {
      if (material.type !== "text" && material.content) {
        const filePath = path.join(
          process.cwd(),
          "uploads/materials/",
          material.content
        );
        try {
          if (fs.existsSync(filePath)) fs.rmSync(filePath);
        } catch (err) {
          console.error("Failed to delete file:", filePath, err);
        }
      }
    }

    // --- Delete all materials from DB ---
    await Material.deleteMany({ _id: { $in: materials.map((m) => m._id) } });

    // --- Delete exercises and chapters ---
    await Exercise.deleteMany({ _id: { $in: exercises.map((e) => e._id) } });
    await Chapter.deleteMany({ _id: { $in: chapters.map((c) => c._id) } });

    // --- Finally delete the subject ---
    await subject.deleteOne();

    return res.status(200).json({
      success: true,
      msg: `Subject "${subject.name}" and all its chapters, exercises, and materials have been deleted`,
    });
  } catch (error) {
    console.error("Delete Subject Error:", error);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  addSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};
