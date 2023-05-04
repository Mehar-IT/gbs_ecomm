const ErrorHandler = require("../utils/errorhandlers");
const asyncErrorHandler = require("./asyncErrorHandler");
const JWT = require("jsonwebtoken");
const User = require("../models/userModel");
const { decryptData } = require("../utils/cipher");
const Roles = require("../models/userRolesModel");

exports.isAuthenticated = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("please login to access this resource", 401));
  }

  const decodedToken = decryptData(token);

  const decodedData = JWT.verify(decodedToken, process.env.JWT_KEY);
  req.user = await User.findById(decodedData.id);
  next();
});

exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

exports.authorizePermisions = asyncErrorHandler(async (req, res, next) => {
  const roles = await Roles.findOne({ role: req.user.role });

  if (roles === null) {
    return next(
      new ErrorHandler(
        `your role is not added by admin to access this resource`,
        403
      )
    );
  }

  if (
    roles.permissions.forEach(
      ({ path, method }) =>
        path.includes(req.originalUrl) && method.includes(req.method)
    )
  ) {
    return next(
      new ErrorHandler(
        `role ${req.user.role} is not allowed to access this resource`,
        403
      )
    );
  }
  next();
});
