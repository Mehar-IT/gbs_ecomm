const express = require("express");
const {
  createDelivery,
  getDeliveryByNation,
  updateDeliveryByNation,
} = require("../controllers/deliveryController");
const {
  authorizePermisions,
  isAuthenticatedForEmployee,
} = require("../middleware/auth");
const router = express.Router();

router
  .route("/delivery/createDelivery")
  .post(isAuthenticatedForEmployee, authorizePermisions, createDelivery);

router
  .route("/delivery/getDeliveryByNation")
  .get(isAuthenticatedForEmployee, authorizePermisions, getDeliveryByNation);
router
  .route("/delivery/updateDeliveryByNation")
  .put(isAuthenticatedForEmployee, authorizePermisions, updateDeliveryByNation);

module.exports = router;
