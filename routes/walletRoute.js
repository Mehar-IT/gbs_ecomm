const express = require("express");
const {
  createWallet,
  getLatestWallet,
} = require("../controllers/walletController");
const {
  authorizePermisions,
  isAuthenticatedForEmployee,
} = require("../middleware/auth");
const router = express.Router();

router
  .route("/wallet/createWallet")
  .post(isAuthenticatedForEmployee, authorizePermisions, createWallet);

router.route("/wallet/getLatestWallet").get(getLatestWallet);

module.exports = router;
