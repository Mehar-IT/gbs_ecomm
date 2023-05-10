const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  getAdminProducts,
  getProductCategories,
} = require("../controllers/productController");
const {
  isAuthenticatedForEmployee,
  authorizePermisions,
} = require("../middleware/auth");

const router = express.Router();

router.route("/products/getallproducts").get(getAllProducts);
router.route("/products/getProductDetail/:id").get(getProductDetail);
router.route("/products/getProductCategories").get(getProductCategories);

router
  .route("/products/admin/createProduct")
  .post(isAuthenticatedForEmployee, authorizePermisions, createProduct);
router
  .route("/products/admin/updateProduct/:id")
  .put(isAuthenticatedForEmployee, authorizePermisions, updateProduct);
router
  .route("/products/admin/deleteProduct/:id")
  .delete(isAuthenticatedForEmployee, authorizePermisions, deleteProduct);
router
  .route("/products/admin/allProductsByAdmin")
  .get(isAuthenticatedForEmployee, authorizePermisions, getAdminProducts);

module.exports = router;
