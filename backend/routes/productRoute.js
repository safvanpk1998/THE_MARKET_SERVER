const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productDetais,
  reviewProduct,
  getProductReviews,
  deletetReviews,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();



router.route("/products").get( getAllProduct);

router
  .route("/admin/products/new")
  .post( createProduct);
router;

router
  .route("/admin/product/:id")

  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct)

  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);

router.route("/product/:id").get( productDetais);

router.route("/review").put(isAuthenticatedUser, reviewProduct);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deletetReviews);

module.exports = router;
