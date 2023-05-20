const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    nation: {
      type: String,
      required: true,
    },
    expectedDeliveryDate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Delivery", deliverySchema);
