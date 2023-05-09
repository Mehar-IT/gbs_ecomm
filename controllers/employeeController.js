const Employee = require("../models/employeeModel");
const ErrorHandler = require("../utils/errorhandlers");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const sendToken = require("../utils/jwtToken");

exports.registerEmployee = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const employee = await Employee({
    name,
    email,
    password,
    role,
    avatar: {
      public_id: name,
      url: "https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png",
    },
  });

  await employee.save({ validateBeforeSave: true });

  res.status(201).json({
    success: true,
    message: `${name} is registered successfully`,
  });
});

exports.loginEmployee = asyncErrorHandler(async (req, res, next) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("please enter email and password", 400));
  }

  let employee = await Employee.findOne({
    email,
    password,
  });

  if (!employee) {
    return next(new ErrorHandler("Invalid email and password", 401));
  }

  if (!employee.approvalByAdmin) {
    return res.status(201).json({
      success: true,
      message: `you are banned by Admin....`,
    });
  }

  await employee.save({ validateBeforeSave: true });

  sendToken(employee, 200, res);
});

exports.getEmployeeDetails = asyncErrorHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.user.id);

  res.status(200).json({
    success: true,
    employee,
  });
});

exports.updateEmployeeProfile = asyncErrorHandler(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  await Employee.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindandModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

exports.getAllEmployees = asyncErrorHandler(async (req, res, next) => {
  const employees = await Employee.find();
  res.status(200).json({
    success: true,
    employees,
  });
});

exports.getsindleEmployeeByAdmin = asyncErrorHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorHandler(`employee not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    employee,
  });
});

exports.updateEmployeeByAdmin = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
  };

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    newUserData,
    {
      new: true,
      runValidators: true,
      userFindandModify: false,
    }
  );

  if (!employee) {
    return next(
      new ErrorHandler(`employee not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
  });
});

exports.deleteEmployeeByAdmin = asyncErrorHandler(async (req, res, next) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    return next(
      new ErrorHandler(`employee not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

exports.approvalEmployeeByAdmin = asyncErrorHandler(async (req, res, next) => {
  const { approvalByAdmin } = req.body;

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    { approvalByAdmin },
    {
      new: true,
      runValidators: true,
      userFindandModify: false,
    }
  );
  if (!employee) {
    return next(
      new ErrorHandler(`employee not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
  });
});
