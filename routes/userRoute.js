const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateUserProfile,
  getAllUsers,
  getsindleUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  validateOTP,
  resentOTP,
  approvalUserByAdmin,
} = require("../controllers/userController");
const { isAuthenticated, authorizePermisions } = require("../middleware/auth");
const router = express.Router();

router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/password/forgot").post(forgotPassword);
router.route("/auth/validateOTP").post(validateOTP);
router.route("/auth/resentOTP/:email").post(resentOTP);
router.route("/auth/password/reset/:token").put(resetPassword);
router.route("/auth/logout").get(logoutUser);

router.route("/users/getUserDetail").get(isAuthenticated, getUserDetails);
router.route("/users/password-update").put(isAuthenticated, updatePassword);
router.route("/users/updateProfile").put(isAuthenticated, updateUserProfile);

router
  .route("/users/admin/getallusers")
  .get(isAuthenticated, authorizePermisions, getAllUsers);
router
  .route("/users/admin/getSingleUser/:id")
  .get(isAuthenticated, authorizePermisions, getsindleUserByAdmin);

router
  .route("/users/admin/updateUser/:id")
  .put(isAuthenticated, authorizePermisions, updateUserByAdmin);
router
  .route("/users/admin/deleteUsers/:id")
  .delete(isAuthenticated, authorizePermisions, deleteUserByAdmin);
router
  .route("/users/admin/userApproval/:id")
  .put(isAuthenticated, authorizePermisions, approvalUserByAdmin);

module.exports = router;
