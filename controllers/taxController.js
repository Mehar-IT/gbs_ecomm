const Tax = require("../models/taxModel");
const ErrorHandler = require("../utils/errorhandlers");
const asyncErrorHandler = require("../middleware/asyncErrorHandler"); // Update with the actual path to the roles data file

exports.createTax = asyncErrorHandler(async (req, res, next) => {
  const { country, taxPrice, shippingPrice } = req.body;
  console.log(country);

  const tax = await Tax.create({ country, taxPrice, shippingPrice });
  res.status(201).json({
    success: true,
    tax,
  });
});

exports.updateTax = asyncErrorHandler(async (req, res, next) => {
  let tax = await Tax.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!tax) {
    return next(new ErrorHandler("Tax not found", 404));
  }

  res.status(200).json({
    success: true,
    tax,
  });
});

exports.deleteTax = asyncErrorHandler(async (req, res, next) => {
  const tax = await Tax.findByIdAndDelete(req.params.id);

  if (!tax) {
    return next(new ErrorHandler("Tax not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Role is deleted",
  });
});

exports.getSingleTax = asyncErrorHandler(async (req, res, next) => {
  const tax = await Tax.findById(req.params.id);

  if (!tax) {
    return next(new ErrorHandler("tax not found", 404));
  }

  res.status(200).json({
    success: true,
    tax,
  });
});

exports.getSingleTaxByCountry = asyncErrorHandler(async (req, res, next) => {
  const tax = await Tax.findOne({ country: req.params.country });

  if (!tax) {
    return next(new ErrorHandler("tax not found", 404));
  }

  res.status(200).json({
    success: true,
    tax,
  });
});

exports.getAllTaxes = asyncErrorHandler(async (req, res, next) => {
  const tax = await Tax.find();

  res.status(200).json({
    success: true,
    tax,
  });
});
