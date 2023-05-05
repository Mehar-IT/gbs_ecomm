const Roles = require("../models/userRolesModel");
const ErrorHandler = require("../utils/errorhandlers");
const asyncErrorHandler = require("../middleware/asyncErrorHandler"); // Update with the actual path to the roles data file

exports.createRole = asyncErrorHandler(async (req, res, next) => {
  const { role, permissions } = req.body;
  let user_permissions = [];

  if (typeof permissions === "string") {
    user_permissions.push(permissions);
  } else {
    user_permissions = permissions;
  }
  const roles = await Roles.create({ role, permissions: user_permissions });
  res.status(201).json({
    success: true,
    roles,
  });
});

exports.updateRole = asyncErrorHandler(async (req, res, next) => {
  let permissions = [];

  if (typeof req.body.permissions === "string") {
    permissions.push(req.body.permissions);
  } else {
    permissions = req.body.permissions;
  }

  let role = await Roles.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!role) {
    return next(new ErrorHandler("Role not found", 404));
  }

  res.status(200).json({
    success: true,
    role,
  });
});

exports.deleteRole = asyncErrorHandler(async (req, res, next) => {
  const role = await Roles.findByIdAndDelete(req.params.id);

  if (!role) {
    return next(new ErrorHandler("Role not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Role is deleted",
  });
});

exports.getSingleRole = asyncErrorHandler(async (req, res, next) => {
  const role = await Roles.findById(req.params.id);

  if (!role) {
    return next(new ErrorHandler("Role not found", 404));
  }

  res.status(200).json({
    success: true,
    role,
  });
});

exports.getAllRoles = asyncErrorHandler(async (req, res, next) => {
  const roles = await Roles.find();

  res.status(200).json({
    success: true,
    roles,
  });
});
