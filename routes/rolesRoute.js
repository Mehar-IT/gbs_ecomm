const express = require("express");
const {
  createRole,
  updateRole,
  deleteRole,
  getSingleRole,
  getAllRoles,
} = require("../controllers/roleController");
const {
  isAuthenticatedForEmployee,
  authorizePermisions,
} = require("../middleware/auth");

const router = express.Router();

router
  .route("/roles/createRole")
  .post(isAuthenticatedForEmployee, authorizePermisions, createRole);
router
  .route("/roles/updateRole/:id")
  .put(isAuthenticatedForEmployee, authorizePermisions, updateRole);
router
  .route("/roles/getSingleRole/:id")
  .get(isAuthenticatedForEmployee, authorizePermisions, getSingleRole);
router
  .route("/roles/getAllRoles")
  .get(isAuthenticatedForEmployee, authorizePermisions, getAllRoles);
router.route("/roles/getAllRolesForPublic").get(getAllRoles);

router
  .route("/roles/deleteRole/:id")
  .delete(isAuthenticatedForEmployee, authorizePermisions, deleteRole);

module.exports = router;
