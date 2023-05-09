const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

router.route("/payment/process-payment").post(isAuthenticated, processPayment);

router.route("/payment/stripeapikey").get(isAuthenticated, sendStripeApiKey);

module.exports = router;
