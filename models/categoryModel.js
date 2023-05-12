const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
