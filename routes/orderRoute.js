const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrder,
  updateOrder,
  deleteOrder,
  getFilteredOrder,
} = require("../controllers/orderController");
const {
  isAuthenticated,
  isAuthenticatedForEmployee,
  authorizePermisions,
} = require("../middleware/auth");

const router = express.Router();

router.route("/orders/createOrder").post(isAuthenticated, newOrder);
router.route("/orders/getSingleOrder/:id").get(isAuthenticated, getSingleOrder);
router.route("/orders/getUserOrders").get(isAuthenticated, myOrders);

router
  .route("/orders/getSingleOrderByAdmin/:id")
  .get(isAuthenticatedForEmployee, authorizePermisions, getSingleOrder);
router
  .route("/orders/admin/getAllOrders")
  .get(isAuthenticatedForEmployee, authorizePermisions, getAllOrder);
router
  .route("/orders/admin/getFilteredOrder")
  .get(isAuthenticatedForEmployee, authorizePermisions, getFilteredOrder);
router
  .route("/orders/admin/updateOrder/:id")
  .put(isAuthenticatedForEmployee, authorizePermisions, updateOrder);
router
  .route("/orders/admin/deleteOrder/:id")
  .delete(isAuthenticatedForEmployee, authorizePermisions, deleteOrder);

module.exports = router;
