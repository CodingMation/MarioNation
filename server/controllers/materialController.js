// controllers/materialController.js
const Material = require("../models/Material");
const fs = require("fs");
const path = require("path");

// ---------------- ADD MATERIAL ----------------
const addMaterial = async (req, res) => {
  try {
    const { type, content, subjectId, chapterId, exerciseId } = req.body;

    // Determine material type and assign the correct ID
    let materialType = null;
    let materialData = {};

    if (exerciseId) {
      materialType = "exercise";
      materialData.exerciseId = exerciseId;
    } else if (chapterId) {
      materialType = "chapter";
      materialData.chapterId = chapterId;
    } else if (subjectId) {
      materialType = "subject";
      materialData.subjectId = subjectId;
    } else {
      return res.status(400).json({
        success: false,
        msg: "At least one of subjectId, chapterId, or exerciseId is required",
      });
    }

    const newMaterial = new Material({
      materialType,
      ...materialData,
      type,
      content: req.file ? `${req.file.filename}` : content || null,
    });

    await newMaterial.save();

    res.status(201).json({
      success: true,
      msg: "Material added successfully",
      material: newMaterial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};


// ---------------- GET MATERIALS (by subject/chapter/exercise) ----------------
const getMaterials = async (req, res) => {
  try {
    const { subjectId, chapterId, exerciseId } = req.params;

    let filter = {};
    if (exerciseId) filter.exerciseId = exerciseId;
    else if (chapterId) filter.chapterId = chapterId;
    else if (subjectId) filter.subjectId = subjectId;
    else {
      return res.status(400).json({
        success: false,
        msg: "Please provide subjectId, chapterId, or exerciseId",
      });
    }

    const materials = await Material.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, materials });
  } catch (error) {
    console.log('err', error.message)
    res.status(500).json({ success: false, msg: error.message });
  }
};

const getMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id).sort({ createdAt: -1 });
    res.status(200).json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// ---------------- DELETE MATERIAL ----------------
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findByIdAndDelete(id);
    if (!material) {
      return res
        .status(404)
        .json({ success: false, msg: "Material not found" });
    }

    // also delete the file if it exists
    if (material.content) {
      const filePath = path.join(__dirname, "../uploads/materials", material.content);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res
      .status(200)
      .json({ success: true, msg: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = { addMaterial, getMaterials, getMaterial, deleteMaterial };