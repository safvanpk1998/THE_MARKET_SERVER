const express = require("express");
const {
  createNewOrder,
  getSingleOrder,
  myOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  razorpayPayment,
  getKey
} = require("../controllers/orderController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, createNewOrder);
router.route("/getkey").get(isAuthenticatedUser, getKey);
router.route("/order/razorpayPayment").post(isAuthenticatedUser, razorpayPayment);
router.route("/order/myorders").get(isAuthenticatedUser, myOrder);
router
  .route("/order/:id")
  .get(isAuthenticatedUser, getSingleOrder)
  .put(isAuthenticatedUser, updateOrder)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);
router
  .route("/admin/allOrders")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllOrders);

module.exports = router;
