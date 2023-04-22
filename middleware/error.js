const ErrorHandler = require("../utils/errorhandlers");

module.exports = (err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || " Internal server error";

  if (err.name === "CastError") {
    const message = `Recource not found. Invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = `Json web token is Expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.status).json({
    Success: false,
    error: err.message,
  });
};
