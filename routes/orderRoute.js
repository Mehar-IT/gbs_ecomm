const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/order/:id").get(isAuthenticated, getSingleOrder);
router.route("/orders/me").get(isAuthenticated, myOrders);
router
  .route("/admin/orders")
  .get(isAuthenticated, authorizeRole("admin"), getAllOrder);
router
  .route("/admin/order/:id")
  .put(isAuthenticated, authorizeRole("admin"), updateOrder)
  .delete(isAuthenticated, authorizeRole("admin"), deleteOrder);

module.exports = router;
