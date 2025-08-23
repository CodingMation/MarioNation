const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    exerciseName: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure unique exercise name per chapter
exerciseSchema.index({ chapterId: 1, exerciseName: 1 }, { unique: true });

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
