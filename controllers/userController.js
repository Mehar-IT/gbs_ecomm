const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandlers");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
// const http = require("http");

exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (avatar === "undefined") {
    return next(new ErrorHandler("Image not found", 404));
  }
  const myCloud = await cloudinary.v2.uploader.upload(avatar, {
    folder: "profile",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    userIP: ip,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  const userData = await User.findById(user._id);
  sendToken(userData, 201, res);
});

exports.loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email and password", 401));
  }
  const isPasswordMatch = await user.comparePassowrd(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email and password", 401));
  }
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  user.userIP = ip;
  user.save({ validateBeforeSave: true });

  const userData = await User.findById(user._id);
  sendToken(userData, 200, res);
});

exports.logoutUser = asyncErrorHandler(async (req, res, next) => {
  const option = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };
  res.cookie("token", null, option);
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("user not found"), 404);
  }

  const resetToken = user.resetPassword();
  await user.save({ validateBeforeSave: false });

  const resetPassword = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  // const resetPassword = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

  const message = `your password reset token is :- \n\n ${resetPassword} \n\n If you have not requested this email then, please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "reset password token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

exports.getUserDetails = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatch = await user.comparePassowrd(req.body.oldPassword);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid old password", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

exports.updateUserProfile = asyncErrorHandler(async (req, res, next) => {
  const newUserData = { name: req.body.name, email: req.body.email };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindandModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

exports.getsindleUserByAdmin = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("+userIP");

  if (!user) {
    return next(
      new ErrorHandler(`user not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUserByAdmin = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    userFindandModify: false,
  });

  if (!user) {
    return next(
      new ErrorHandler(`user not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
  });
});

exports.deleteUserByAdmin = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user not found with id ${req.params.id}`, 404)
    );
  }

  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

// Importing https module
// exports.getUserIp = asyncErrorHandler(async (req, res, next) => {
//   // const user_IP = req.socket.remoteAddress;
//   // const user_IP = req.ip;

//   // res.status(200).json({
//   //   success: true,
//   //   user_IP,
//   // });
//   const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//   const url = `http://ip-api.com/json/${ip}`;

//   http
//     .get(url, (resp) => {
//       let data = "";

//       // A chunk of data has been received.
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });

//       // The whole response has been received. Print out the result.
//       resp.on("end", () => {
//         res.status(200).json(JSON.parse(data));
//       });
//     })
//     .on("error", (err) => {
//       console.log("Error: " + err.message);
//     });

//   // res.send("ok");
// });
