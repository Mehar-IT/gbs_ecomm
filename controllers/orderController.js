const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Delivery = require("../models/deliveryModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandlers");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const sendEmail = require("../utils/sendEmail");
const ApiFeature = require("../utils/apiFeature");

exports.newOrder = asyncErrorHandler(async (req, res, next) => {
  const { shippingInfo, orderItems, itemsPrice, shippingPrice } = req.body;

  const totalPrice = itemsPrice + shippingPrice;

  const nation =
    shippingInfo.country.toLowerCase() === "italy" ? "italy" : "worldwide";
  let delivery = await Delivery.findOne({ nation: nation });

  if (!delivery) {
    return next(
      new ErrorHandler("Delivery date not found with your nation", 404)
    );
  }

  // const date =
  //   shippingInfo.country.toLowerCase() === "itlay"
  //     ? process.env.NATION_DELIVERY
  //     : process.env.WORLD_DELIVERY;

  const currentDate = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(currentDate.getDate() + delivery.expectedDeliveryDate);

  let digitalProducts = [];
  let physicalProducts = [];
  async function processOrderItems() {
    for (const order of orderItems) {
      const product = await Product.findById(order.product);

      if (product.productType.toLowerCase() === "digital") {
        product.stock -= order.quantity;
        await product.save({ validateBeforeSave: false });
        digitalProducts.push(product);
      } else {
        physicalProducts.push(product);
      }
    }
  }
  await processOrderItems();

  const order = await Order({
    shippingInfo,
    orderItems,
    itemsPrice,
    shippingPrice,
    totalPrice: totalPrice,
    expectedDeliveryDate: deliveryDate,
    vat: req.body?.vat,
    businessName: req.body?.businessName,
    businessAddress: req.body?.businessAddress,
    paidAt: Date.now(),
    user: req.user._id,
  });

  let message = "";

  if (digitalProducts.length !== 0 && physicalProducts.length !== 0) {
    message = `your digital order is delivered (you can download from your portal) but wait for your physical product to process against your order id ${order._id}`;
  } else if (digitalProducts.length !== 0) {
    order.deliveredAt = Date.now();
    order.orderStatus = "delivered";
    order.expectedDeliveryDate = Date.now();
    message = `your digital order is delivered (you can download from your portal) against your order id ${order._id}`;
  } else {
    message = `your order is confirmed your order id is ${order._id}`;
  }

  await order.save({ validateBeforeSave: true });

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

exports.paymentOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("order not found with this id", 404));
  }

  order.paymentInfo = req.body.paymentInfo;
  await order.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    order,
    message: `payment success against order id ${req.params.id}`,
  });
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
      await updateStock(order.product, order.quantity);
    });
    sendEmailOrder(
      req.body.status.toLowerCase(),
      order._id,
      order.user.email,
      next
    );
  }

  order.orderStatus = req.body.status.toLowerCase();
  if (req.body.status.toLowerCase() === "delivered") {
    order.deliveredAt = Date.now();
    order.expectedDeliveryDate = Date.now();
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

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  if (product.productType.toLowerCase() === "physical") {
    product.stock -= quantity;
  }
  await product.save({ validateBeforeSave: false });
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

exports.myDigitalOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  }).populate("user", "name email");

  let digitalProducts = [];
  async function processOrderItems() {
    for (const order of orders) {
      for (const orderItem of order.orderItems) {
        const product = await Product.findById(orderItem.product);
        if (product.productType.toLowerCase() === "digital") {
          digitalProducts.push({ quantity: orderItem.quantity, product });
        }
      }
    }
  }
  await processOrderItems();

  res.status(200).json({
    success: true,
    digitalProducts,
  });
});
