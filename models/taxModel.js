const mongoose = require("mongoose");

const TaxSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      unique: true,
      required: true,
    },
    nationShipping: {
      type: Number,
      required: true,
    },
    worldShipping: {
      type: Number,
      required: true,
    },
    // taxPrice: {
    //   type: Number,
    //   default: 0,
    // },
    // shippingPrice: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tax", TaxSchema);
