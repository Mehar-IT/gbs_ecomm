const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Wallet", walletSchema);
