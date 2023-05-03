const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const {
  isAuthenticated,
  authorizeRole,
  authorizePermisions,
} = require("../middleware/auth");

const router = express.Router();

router
  .route("/orders/createOrder")
  .post(isAuthenticated, authorizePermisions, newOrder);
router
  .route("/orders/getSingleOrder/:id")
  .get(isAuthenticated, authorizePermisions, getSingleOrder);
router
  .route("/orders/getUserOrders")
  .get(isAuthenticated, authorizePermisions, myOrders);
router
  .route("/orders/admin/getAllOrders")
  .get(
    isAuthenticated,
    authorizeRole("admin"),
    authorizePermisions,
    getAllOrder
  );
router
  .route("/orders/admin/updateOrder/:id")
  .put(
    isAuthenticated,
    authorizeRole("admin"),
    authorizePermisions,
    updateOrder
  );
router
  .route("/orders/admin/deleteOrder/:id")
  .delete(
    isAuthenticated,
    authorizeRole("admin"),
    authorizePermisions,
    deleteOrder
  );

module.exports = router;
