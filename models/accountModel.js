const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accTitle: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accNumber: {
      type: Number,
      required: true,
    },
    swiftCode: {
      type: String,
      required: true,
    },
    routingNumber: {
      type: String,
      required: true,
    },
    bankAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);
