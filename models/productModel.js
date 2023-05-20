const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please Enter product description"],
    },
    price: {
      type: Number,
      required: [true, "please enter product price"],
    },
    productType: {
      type: String,
      required: true,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "please enter product category"],
    },
    stock: {
      type: Number,
      required: [true, "please enter product stock"],
      maxLength: [4, "stock can not exceed 4 characters"],
      default: 1,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
