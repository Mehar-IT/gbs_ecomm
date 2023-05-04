const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController");
const router = express.Router();
const { isAuthenticated, authorizePermisions } = require("../middleware/auth");

router
  .route("/payment/process-payment")
  .post(isAuthenticated, authorizePermisions, processPayment);

router
  .route("/payment/stripeapikey")
  .get(isAuthenticated, authorizePermisions, sendStripeApiKey);

module.exports = router;
