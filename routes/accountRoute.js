const express = require("express");
const {
  deleteAccount,
  getAllAccounts,
  getAccountDetails,
  createAccount,
  updateAccount,
  getLatestAccount,
} = require("../controllers/accountController");
const {
  authorizePermisions,
  isAuthenticatedForEmployee,
} = require("../middleware/auth");
const router = express.Router();

router
  .route("/account/createAccount")
  .post(isAuthenticatedForEmployee, authorizePermisions, createAccount);

router.route("/account/getAllAccounts").get(getAllAccounts);

router.route("/account/getLatestAccount").get(getLatestAccount);

router.route("/account/getAccountDetails/:id").get(getAccountDetails);

router
  .route("/account/updateAccount/:id")
  .put(isAuthenticatedForEmployee, authorizePermisions, updateAccount);

router
  .route("/account/deleteAccount/:id")
  .delete(isAuthenticatedForEmployee, authorizePermisions, deleteAccount);

module.exports = router;
