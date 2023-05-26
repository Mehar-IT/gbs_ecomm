const Delivery = require("../models/deliveryModel");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ErrorHandler = require("../utils/errorhandlers");

exports.createDelivery = asyncErrorHandler(async (req, res, next) => {
  const { nation, expectedDeliveryDate } = req.body;

  const delivery = await Delivery({
    nation,
    expectedDeliveryDate,
  });

  await delivery.save({ validateBeforeSave: true });

  res.status(201).json({
    success: true,
    delivery,
  });
});

exports.getDeliveryByNation = asyncErrorHandler(async (req, res, next) => {
  const delivery = await Delivery.findOne({ nation: req.query.nation });
  if (!delivery) {
    return next(new ErrorHandler("Delivery date not found", 404));
  }
  res.status(200).json({
    success: true,
    delivery,
  });
});

exports.getAllDelivery = asyncErrorHandler(async (req, res, next) => {
  const deliveries = await Delivery.findOne();

  res.status(200).json({
    success: true,
    deliveries,
  });
});

exports.updateDeliveryByNation = asyncErrorHandler(async (req, res, next) => {
  const delivery = await Delivery.findOneAndUpdate(
    { nation: req.query.nation },
    { expectedDeliveryDate: req.body.expectedDeliveryDate },
    {
      new: true,
      runValidators: true,
      userFindandModify: false,
    }
  );

  if (!delivery) {
    return next(new ErrorHandler("Delivery date not found", 404));
  }
  res.status(200).json({
    success: true,
    delivery,
  });
});
