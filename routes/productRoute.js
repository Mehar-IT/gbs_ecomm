const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  getAdminProducts,
} = require("../controllers/productController");
const { isAuthenticated, authorizePermisions } = require("../middleware/auth");

const router = express.Router();

router.route("/products/getallproducts").get(getAllProducts);
router.route("/products/getProductDetail/:id").get(getProductDetail);

router
  .route("/products/admin/createProduct")
  .post(isAuthenticated, authorizePermisions, createProduct);
router
  .route("/products/admin/updateProduct/:id")
  .put(isAuthenticated, authorizePermisions, updateProduct);
router
  .route("/products/admin/deleteProduct/:id")
  .delete(isAuthenticated, authorizePermisions, deleteProduct);
router
  .route("/products/admin/allProductsByAdmin")
  .get(isAuthenticated, authorizePermisions, getAdminProducts);

module.exports = router;
