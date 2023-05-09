const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthenticated, authorizePermisions } = require("../middleware/auth");

const router = express.Router();

router.route("/orders/createOrder").post(isAuthenticated, newOrder);
router.route("/orders/getSingleOrder/:id").get(isAuthenticated, getSingleOrder);
router.route("/orders/getUserOrders").get(isAuthenticated, myOrders);

router
  .route("/orders/admin/getAllOrders")
  .get(isAuthenticated, authorizePermisions, getAllOrder);
router
  .route("/orders/admin/updateOrder/:id")
  .put(isAuthenticated, authorizePermisions, updateOrder);
router
  .route("/orders/admin/deleteOrder/:id")
  .delete(isAuthenticated, authorizePermisions, deleteOrder);

module.exports = router;
