const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    materialType: {
      type: String,
      enum: ["subject", "chapter", "exercise"],
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      default: null,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      default: null,
    },
    type: { type: String, enum: ["text", "image", "file"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Material = mongoose.model("Material", materialSchema);
module.exports = Material;