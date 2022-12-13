const express = require("express");
const {
createNewWishList, myWishList, deleteWishList
} = require("../controllers/wishListController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();
router.route("/wishlist/new/:id").post(isAuthenticatedUser, createNewWishList)
router.route("/wishlist/myWishList").get(isAuthenticatedUser, myWishList)
router.route("/wishlist/:id").delete(isAuthenticatedUser,deleteWishList )
module.exports = router;