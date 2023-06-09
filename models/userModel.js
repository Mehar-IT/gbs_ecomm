const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const { encryptData } = require("../utils/cipher");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxLength: [30, "name can not exceed 30 character "],
    minLength: [4, "name should have more than 4 character"],
  },
  surname: String,
  country: String,
  city: String,
  street: String,
  vat: String,
  userName: {
    type: String,
    unique: true,
    required: [true, "please enter userName"],
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
    select: false,
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
  // role: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "User",
  // },
  role: {
    type: String,
    default: "customer",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  userIP: {
    type: String,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  approvalByAdmin: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  otpToken: String,
  optExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
  const token = JWT.sign({ id: this._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return encryptData(token);
};

userSchema.methods.resetPassword = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

userSchema.methods.otpGeneration = function () {
  const opt = Math.floor(10000 + Math.random() * 9000);
  this.otpToken = opt;
  this.optExpire = Date.now() + 15 * 60 * 1000;
  return opt;
};

userSchema.methods.comparePassowrd = async function (password) {
  return bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
