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
const {
  isAuthenticated,
  authorizePermisions,
  authorizeRole,
} = require("../middleware/auth");

const router = express.Router();

router
  .route("/products/getallproducts")
  .get(authorizePermisions, getAllProducts);
router
  .route("/products/admin/createProduct")
  .post(
    isAuthenticated,
    authorizeRole("admin"),
    authorizePermisions,
    createProduct
  );
router
  .route("/products/admin/updateProduct/:id")
  .put(
    isAuthenticated,
    authorizeRole("admin"),
    authorizePermisions,
    updateProduct
  );
router
  .route("/products/admin/deleteProduct/:id")
  .delete(
    isAuthenticated,
    authorizeRole("admin"),
    authorizePermisions,
    deleteProduct
  );
router
  .route("/products/admin/getallproducts")
  .get(
    isAuthenticated,
    authorizeRole("admin"),
    authorizePermisions,
    getAdminProducts
  );
router.route("/products/getProductDetail/:id").get(getProductDetail);

// router.route("/review").put(isAuthenticated, createProductReview);
// router
//   .route("/reviews")
//   .get(getProductReviews)
//   .delete(isAuthenticated, deleteReview);

module.exports = router;
