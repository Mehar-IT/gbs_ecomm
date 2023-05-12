const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandlers");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const sendEmail = require("../utils/sendEmail");
const ApiFeature = require("../utils/apiFeature");

exports.newOrder = asyncErrorHandler(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, itemsPrice, shippingPrice } =
    req.body;

  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    totalPrice: totalPrice,
    vat: req.body?.vat,
    businessName: req.body?.businessName,
    businessAddress: req.body?.businessAddress,
    paidAt: Date.now(),
    user: req.user._id,
  });
  const message = `your Order is confirmed your order id is ${order._id}`;

  const user = await User.findById(req.user._id);

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Order`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.getSingleOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("order not found with this id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.myOrders = asyncErrorHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "user",
    "name email"
  );

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.getAllOrder = asyncErrorHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email");

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: "user",
    select: "email",
  });

  if (!order) {
    return next(new ErrorHandler("order not found with this id", 404));
  }

  if (order.orderStatus === "delivered") {
    return next(
      new ErrorHandler("you have already deliverd this product", 400)
    );
  }

  if (req.body.status.toLowerCase() === "shipped") {
    order.orderItems.forEach(async (order) => {
      await updateStock(
        order.product,
        order.quantity,
        order._id,
        order.user.email,
        req.body.status.toLowerCase()
      );
    });
  }

  order.orderStatus = req.body.status.toLowerCase();
  if (req.body.status.toLowerCase() === "delivered") {
    order.deliveredAt = Date.now();
    sendEmailOrder(
      req.body.status.toLowerCase(),
      order._id,
      order.user.email,
      next
    );
  }
  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Email sent to ${order.user.email} successfully`,
  });
});

async function updateStock(id, quantity, orderID, email, status) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
  sendEmailOrder(status, orderID, email, next);
}

async function sendEmailOrder(status, orderID, email, next) {
  const message = `your Order is ${status} against order id ${orderID}`;
  try {
    await sendEmail({
      email,
      subject: `Ecommerce Order`,
      message,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("order not found with this id", 404));
  }
  await order.remove();

  res.status(200).json({
    success: true,
  });
});

exports.getFilteredOrder = asyncErrorHandler(async (req, res, next) => {
  const apifeature = new ApiFeature(Order.find(), req.query).order().filter();
  let orders = await apifeature.query.populate("user", "email name");

  let soldItems = 0;
  let totalRevenue = 0;
  orders.forEach((order) => {
    totalRevenue = totalRevenue + order.itemsPrice;
    order.orderItems.forEach((item) => {
      soldItems = soldItems + item.quantity;
    });
  });

  res.status(200).json({
    success: true,
    soldItems,
    totalRevenue,
    orders,
  });
});
