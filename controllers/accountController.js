const Account = require("../models/accountModel");
const ErrorHandler = require("../utils/errorhandlers");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");

exports.createAccount = asyncErrorHandler(async (req, res, next) => {
  const { accTitle, bankName, accNumber, swiftCode, bankAddress } = req.body;

  const account = await Account({
    accTitle,
    bankName,
    accNumber,
    swiftCode,
    bankAddress,
    routingNumber,
  });

  await account.save({ validateBeforeSave: true });

  res.status(201).json({
    success: true,
    account,
  });
});

exports.deleteAccount = asyncErrorHandler(async (req, res, next) => {
  const account = await Account.findOneAndDelete({ _id: req.params.id });

  if (!account) {
    return next(
      new ErrorHandler(`account not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "account Deleted Successfully",
  });
});

exports.updateAccount = asyncErrorHandler(async (req, res) => {
  const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    userFindandModify: false,
  });

  if (!account) {
    return next("Account not found with this Id", 404);
  }

  res.status(200).json({
    success: true,
    account,
  });
});

exports.getAccountDetails = asyncErrorHandler(async (req, res, next) => {
  const account = await Account.findById(req.params.id);

  if (!account) {
    return next("Account not found with this Id", 404);
  }

  res.status(200).json({
    success: true,
    account,
  });
});

exports.getAllAccounts = asyncErrorHandler(async (req, res, next) => {
  const accounts = await Account.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    accounts,
  });
});

exports.getLatestAccount = asyncErrorHandler(async (req, res, next) => {
  const accounts = await Account.findOne().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    accounts,
  });
});
