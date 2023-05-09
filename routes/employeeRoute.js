const express = require("express");
const {
  approvalEmployeeByAdmin,
  deleteEmployeeByAdmin,
  getAllEmployees,
  getEmployeeDetails,
  getsindleEmployeeByAdmin,
  loginEmployee,
  registerEmployee,
  updateEmployeeProfile,
  updateEmployeeByAdmin,
} = require("../controllers/employeeController");
const {
  isAuthenticatedForEmployee,
  authorizePermisions,
} = require("../middleware/auth");
const router = express.Router();

router.route("/employee/loginEmployee").post(loginEmployee);

router
  .route("/employee/registerEmployee")
  .post(isAuthenticatedForEmployee, authorizePermisions, registerEmployee);
router
  .route("/employee/getEmployeeDetails")
  .get(isAuthenticatedForEmployee, getEmployeeDetails);
router
  .route("/employee/updateEmployeeProfile")
  .put(isAuthenticatedForEmployee, updateEmployeeProfile);

router
  .route("/employee/admin/getAllEmployees")
  .get(isAuthenticatedForEmployee, authorizePermisions, getAllEmployees);
router
  .route("/employee/admin/getsindleEmployeeByAdmin/:id")
  .get(
    isAuthenticatedForEmployee,
    authorizePermisions,
    getsindleEmployeeByAdmin
  );
router
  .route("/employee/admin/updateEmployeeByAdmin/:id")
  .put(isAuthenticatedForEmployee, authorizePermisions, updateEmployeeByAdmin);
router
  .route("/employee/admin/deleteEmployeeByAdmin/:id")
  .delete(
    isAuthenticatedForEmployee,
    authorizePermisions,
    deleteEmployeeByAdmin
  );
router
  .route("/employee/admin/approvalEmployeeByAdmin/:id")
  .put(
    isAuthenticatedForEmployee,
    authorizePermisions,
    approvalEmployeeByAdmin
  );

module.exports = router;
