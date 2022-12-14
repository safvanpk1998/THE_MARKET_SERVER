const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateProfileRole,
  deleteProfile,
  confirmOtp
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/confirmOtp").post(confirmOtp);
router.route("/password/reset").put(resetPassword);

router.route("/userDeatils").get(isAuthenticatedUser, getUserDetails);
router
  .route("/password/updatePassword")
  .put(isAuthenticatedUser, updatePassword);
router.route("/me/updateProfile").put(isAuthenticatedUser, updateProfile);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUser);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProfileRole)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProfile);

module.exports = router;
