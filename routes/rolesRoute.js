const express = require("express");
const {
  createRole,
  updateRole,
  deleteRole,
  getSingleRole,
  getAllRoles,
} = require("../controllers/roleController");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router
  .route("/roles/createRole")
  .post(isAuthenticated, authorizeRole("admin"), createRole);
router
  .route("/roles/updateRole")
  .put(isAuthenticated, authorizeRole("admin"), updateRole);
router
  .route("/roles/getSingleRole/:id")
  .get(isAuthenticated, authorizeRole("admin"), getSingleRole);
router
  .route("/roles/getAllRoles")
  .get(isAuthenticated, authorizeRole("admin"), getAllRoles);
router
  .route("/roles/deleteRole/:id")
  .delete(isAuthenticated, authorizeRole("admin"), deleteRole);

module.exports = router;
