const Category = require("../models/categoryModel");
const ErrorHandler = require("../utils/errorhandlers");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");

exports.createCategory = asyncErrorHandler(async (req, res, next) => {
  const category = await Category({
    category: req.body?.category,
  });

  await category.save({ validateBeforeSave: true });

  res.status(201).json({
    success: true,
    category,
  });
});

exports.deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const category = await Category.findOneAndDelete({ _id: req.params.id });

  if (!category) {
    return next(
      new ErrorHandler(`category not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "category Deleted Successfully",
  });
});

exports.updateCategory = asyncErrorHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      category: req.body?.category,
    },
    {
      new: true,
      runValidators: true,
      userFindandModify: false,
    }
  );

  if (!category) {
    return next("Category not found with this Id", 404);
  }

  res.status(200).json({
    success: true,
    category,
  });
});

exports.getCategoryDetails = asyncErrorHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next("Category not found with this Id", 404);
  }

  res.status(200).json({
    success: true,
    category,
  });
});

exports.getAllCategories = asyncErrorHandler(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    categories,
  });
});
