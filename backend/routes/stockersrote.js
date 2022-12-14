const express = require("express");
const {
createNewstocker,AllStockers,deletestockert
} = require("../controllers/stockerController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();
router.route("/stocker/new").post(isAuthenticatedUser, createNewstocker)
router.route("/stocker/allstocker").get( AllStockers)
router.route("/stocker/:id").delete(isAuthenticatedUser,deletestockert )
module.exports = router;