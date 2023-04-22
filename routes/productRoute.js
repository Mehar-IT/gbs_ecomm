const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  getAdminProducts,
  // createProductReview,
  // getProductReviews,
  // deleteReview,
} = require("../controllers/productController");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/admin/product/new")
  .post(isAuthenticated, authorizeRole("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticated, authorizeRole("admin"), updateProduct)
  .delete(isAuthenticated, authorizeRole("admin"), deleteProduct);
router
  .route("/admin/products")
  .get(isAuthenticated, authorizeRole("admin"), getAdminProducts);
router.route("/product/:id").get(getProductDetail);

// router.route("/review").put(isAuthenticated, createProductReview);
// router
//   .route("/reviews")
//   .get(getProductReviews)
//   .delete(isAuthenticated, deleteReview);

module.exports = router;
