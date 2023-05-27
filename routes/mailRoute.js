const express = require("express");
const {
  getMailDetails,
  createMail,
  getAllMails,
} = require("../controllers/mailController");
const {
  authorizePermisions,
  isAuthenticatedForEmployee,
} = require("../middleware/auth");
const router = express.Router();

router
  .route("/mail/createMail")
  .post(isAuthenticatedForEmployee, authorizePermisions, createMail);

router
  .route("/mail/getAllMails")
  .get(isAuthenticatedForEmployee, authorizePermisions, getAllMails);

router
  .route("/mail/getMailDetails/:id")
  .get(isAuthenticatedForEmployee, authorizePermisions, getMailDetails);

module.exports = router;
