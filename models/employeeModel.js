const mongoose = require("mongoose");
const validator = require("validator");
const JWT = require("jsonwebtoken");
const { encryptData } = require("../utils/cipher");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxLength: [30, "name can not exceed 30 character "],
    minLength: [4, "name should have more than 4 character"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    validate: [validator.isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minLength: [8, "password should be greater than 8 characters"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    unique: true,
    required: [true, "Role is required"],
  },
  approvalByAdmin: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

employeeSchema.methods.getJwtToken = function () {
  const token = JWT.sign({ id: this._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return encryptData(token);
};

module.exports = mongoose.model("Employee", employeeSchema);
