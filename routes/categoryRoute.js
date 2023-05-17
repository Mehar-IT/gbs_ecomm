const express = require("express");
const {
  deleteCategory,
  getAllCategories,
  getCategoryDetails,
  createCategory,
  updateCategory,
} = require("../controllers/categoryController");
const {
  authorizePermisions,
  isAuthenticatedForEmployee,
} = require("../middleware/auth");
const router = express.Router();

router
  .route("/category/createCategory")
  .post(isAuthenticatedForEmployee, authorizePermisions, createCategory);

router
  .route("/category/getAllCategories")
  .get(isAuthenticatedForEmployee, authorizePermisions, getAllCategories);

router
  .route("/category/getCategoryDetails/:id")
  .get(isAuthenticatedForEmployee, authorizePermisions, getCategoryDetails);

router
  .route("/category/updateCategory/:id")
  .put(isAuthenticatedForEmployee, authorizePermisions, updateCategory);

router
  .route("/category/deleteCategory/:id")
  .delete(isAuthenticatedForEmployee, authorizePermisions, deleteCategory);

module.exports = router;
