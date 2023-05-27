const express = require("express");
const {
  createDelivery,
  getDeliveryByNation,
  updateDeliveryByNation,
  getAllDelivery,
} = require("../controllers/deliveryController");
const {
  authorizePermisions,
  isAuthenticatedForEmployee,
} = require("../middleware/auth");
const router = express.Router();

router
  .route("/delivery/createDelivery")
  .post(isAuthenticatedForEmployee, authorizePermisions, createDelivery);

router.route("/delivery/getDeliveryByNation").get(getDeliveryByNation);
router.route("/delivery/getAllDelivery").get(getAllDelivery);
router
  .route("/delivery/updateDeliveryByNation")
  .put(isAuthenticatedForEmployee, authorizePermisions, updateDeliveryByNation);

module.exports = router;
