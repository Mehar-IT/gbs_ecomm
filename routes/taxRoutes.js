const express = require("express");
const {
  createTax,
  updateTax,
  deleteTax,
  getSingleTax,
  getAllTaxes,
  getSingleTaxByCountry,
} = require("../controllers/taxController");
const {
  isAuthenticatedForEmployee,
  authorizePermisions,
  isAuthenticated,
} = require("../middleware/auth");

const router = express.Router();

router.route("/tax/getSingleTax/:id").get(isAuthenticated, getSingleTax);
router
  .route("/tax/getSingleTaxByCountry/:country")
  .get(isAuthenticated, getSingleTaxByCountry);
router.route("/tax/getAllTaxes").get(isAuthenticated, getAllTaxes);

router
  .route("/tax/createTax")
  .post(isAuthenticatedForEmployee, authorizePermisions, createTax);
router
  .route("/tax/updateTax/:id")
  .put(isAuthenticatedForEmployee, authorizePermisions, updateTax);
router
  .route("/tax/deleteTax/:id")
  .delete(isAuthenticatedForEmployee, authorizePermisions, deleteTax);

module.exports = router;
