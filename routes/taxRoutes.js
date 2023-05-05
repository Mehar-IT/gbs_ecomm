const express = require("express");
const {
  createTax,
  updateTax,
  deleteTax,
  getSingleTax,
  getAllTaxes,
  getSingleTaxByCountry,
} = require("../controllers/taxController");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router
  .route("/tax/createTax")
  .post(isAuthenticated, authorizeRole("admin"), createTax);
router
  .route("/tax/updateTax/:id")
  .put(isAuthenticated, authorizeRole("admin"), updateTax);
router
  .route("/tax/getSingleTax/:id")
  .get(isAuthenticated, authorizeRole("admin"), getSingleTax);
router
  .route("/tax/getSingleTaxByCountry/:country")
  .get(isAuthenticated, authorizeRole("admin"), getSingleTaxByCountry);
router
  .route("/tax/getAllTaxs")
  .get(isAuthenticated, authorizeRole("admin"), getAllTaxes);
router
  .route("/tax/deleteTax/:id")
  .delete(isAuthenticated, authorizeRole("admin"), deleteTax);

module.exports = router;
