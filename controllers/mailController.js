const Mail = require("../models/mailModel");
const ErrorHandler = require("../utils/errorhandlers");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const sendEmail = require("../utils/sendEmail");

exports.createMail = asyncErrorHandler(async (req, res, next) => {
  const { userID, message, subject } = req.body;

  let mail = await Create({
    user: userID,
    message,
    subject,
  });

  mail = mail.populate("user", "email name");

  const email = mail.user.email;
  const name = mail.user.name;

  try {
    await sendEmail({
      email,
      subject: `Ecommerce Project Message`,
      file: "mail",
      obj: {
        name,
        message,
      },
    });

    res.status(201).json({
      success: true,
      message: `Mail sent to ${email} successfully`,
    });
  } catch (error) {
    user.otpToken = undefined;
    user.optExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
  res.status(201).json({
    success: true,
    mail,
  });
});

exports.getMailDetails = asyncErrorHandler(async (req, res, next) => {
  const mail = await Mail.findById(req.params.id);

  if (!mail) {
    return next("Mail not found with this Id", 404);
  }

  res.status(200).json({
    success: true,
    mail,
  });
});

exports.getAllMails = asyncErrorHandler(async (req, res, next) => {
  const mails = await Mail.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    mails,
  });
});

// exports.deleteMail = asyncErrorHandler(async (req, res, next) => {
//   const mail = await Mail.findOneAndDelete({ _id: req.params.id });

//   if (!mail) {
//     return next(
//       new ErrorHandler(`mail not found with id ${req.params.id}`, 404)
//     );
//   }

//   res.status(200).json({
//     success: true,
//     message: "mail Deleted Successfully",
//   });
// });

// exports.updateMail = asyncErrorHandler(async (req, res) => {
//   const mail = await Mail.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//     userFindandModify: false,
//   });

//   if (!mail) {
//     return next("Mail not found with this Id", 404);
//   }

//   res.status(200).json({
//     success: true,
//     mail,
//   });
// });
// exports.getLatestMail = asyncErrorHandler(async (req, res, next) => {
//   const mails = await Mail.findOne().sort({ createdAt: -1 });

//   res.status(200).json({
//     success: true,
//     mails,
//   });
// });
