const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    subjectId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Subject",
      required: true 
    },
    chapterName: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure unique chapter name per subject
chapterSchema.index({ subjectId: 1, chapterName: 1 }, { unique: true });

const Chapter = mongoose.model("Chapter", chapterSchema);
module.exports = Chapter;