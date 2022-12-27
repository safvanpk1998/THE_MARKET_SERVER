const ErrorHandler = require("../../utils/errorhandler");
const User = require("../models/userModel");
const catchAsyncErrors = require("./catchAsyncErrors");
const JWT = require("jsonwebtoken");
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to Access the resource", 401));
  }


  const decodeddata = JWT.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodeddata.id);
  next();
});
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next ( new ErrorHandler(
        `Role: ${req.user.role} is not allowd to access this resource`,403
      ))
    }
    next();
  };
};
