const Material = require("../models/Material");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../middleware/upload");

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

    let fileUrl = null;
    let publicId = null;
    let resourceType = null;

    if (req.file) {
      const uniqueSuffix = Math.floor(Math.random() * 10e5);
      const uniqueId = "MarioNation-" + Date.now() + "_" + uniqueSuffix;
      const result = await uploadToCloudinary(req.file.buffer, "materials", uniqueId);

      fileUrl = result.secure_url;
      publicId = result.public_id;
      resourceType = result.resource_type;
    }

    const newMaterial = new Material({
      materialType,
      ...materialData,
      type,
      content: fileUrl || content || null,
      publicId: publicId || null,
      resourceType: resourceType || null, // 🔥 store in DB
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
    console.log("err", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// ---------------- GET SINGLE MATERIAL ----------------
const getMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id);
    if (!material)
      return res
        .status(404)
        .json({ success: false, msg: "Material not found" });

    res.status(200).json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// ---------------- DELETE MATERIAL ----------------
const mongoose = require("mongoose");

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    // validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid material ID" });
    }

    // find and delete in one go
    const material = await Material.findById(id);

    if (!material) {
      return res
        .status(404)
        .json({ success: false, msg: "Material not found" });
    }

    // delete from cloudinary if exists
    if (material.publicId) {
      try {
        await deleteFromCloudinary(material.publicId, material.resourceType);
      } catch (err) {
        console.error("Cloudinary delete error:", err.message);
        // still return success for material deletion
      }
    }

    await material.deleteOne();

    res
      .status(200)
      .json({ success: true, msg: "Material deleted successfully" });
  } catch (error) {
    console.error("Delete material error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ---------------- UPDATE MATERIAL ----------------
const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id);
    if (!material)
      return res
        .status(404)
        .json({ success: false, msg: "Material not found" });

        if (req.file) {
          const uniqueSuffix = Math.floor(Math.random() * 10e5);
          const uniqueId = "MarioNation-" + Date.now() + '_' + uniqueSuffix;
          const result = await uploadToCloudinary(req.file.buffer, "materials", uniqueId);
        
          // delete old file
          if (material.publicId) {
            await deleteFromCloudinary(material.publicId, material.resourceType || "raw");
          }
        
          material.content = result.secure_url;
          material.publicId = result.public_id;
          material.resourceType = result.resource_type; // 🔥 update type
          material.name = req.body.name || material.name;
        } else {
      // only update metadata
      material.name = req.body.name || material.name;
      material.type = req.body.type || material.type;
    }

    await material.save();
    res.json({ success: true, material });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  addMaterial,
  getMaterials,
  getMaterial,
  deleteMaterial,
  updateMaterial,
};
