const ErrorHandler = require("../../utils/errorhandler");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //wrong Mongodb ID Error
  if (err.name == "CastError") {
    const message = `Resource not Found, Invalid${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //JsonWebTokenError

  if (err.name == "JsonWebTokenError") {
    const message = `JsonWebTokenError is Invalid, try agin`;
    err = new ErrorHandler(message, 400);
  }

//JWT token expired Error

  if (err.name == "TokenExpiredError") {
    const message = `JsonWebTokenError is expired, try agin`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    // error:err.statusCode,
    message: err.message,
  });
};
