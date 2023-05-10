const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandlers");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ApiFeature = require("../utils/apiFeature");
const cloudinary = require("cloudinary");

exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  let images = [];
  if (req.body.images === undefined) {
    return next(new ErrorHandler("Image not found", 404));
  }
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  const imagesLink = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
      width: 300,
      crop: "scale",
    });
    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLink;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

exports.getAllProducts = asyncErrorHandler(async (req, res) => {
  // const resultPerPage = 8;
  const productCount = await Product.countDocuments();
  const apifeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter();
  let products = await apifeature.query;
  let filteredProductsCount = products.length;
  // apifeature.pagination(resultPerPage);
  // products = await apifeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productCount,
    // resultPerPage,
    filteredProductsCount,
  });
});

exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    products,
  });
});

exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    const imagesLink = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
        width: 300,
        crop: "scale",
      });
      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLink;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }
  // await product.remove();
  res.status(200).json({
    success: true,
    message: "product is deleted",
  });
});

exports.getProductDetail = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.getProductCategories = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find();

  if (products.length === 0) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let categories = products.map((product) => product.category.toLowerCase());
  categories = [...new Set(categories)];

  res.status(200).json({
    success: true,
    categories,
  });
});

// exports.createProductReview = asyncErrorHandler(async (req, res, next) => {
//   const { rating, comment, productId } = req.body;
//   const review = {
//     user: req.user._id,
//     name: req.user.name,
//     rating: Number(rating),
//     comment,
//   };

//   const product = await Product.findById(productId);

//   if (!product) {
//     return next(new ErrorHandler("product not found", 404));
//   }

//   const isReviewed = product.reviews.find(
//     (rev) => rev.user.toString() === req.user._id.toString()
//   );

//   if (isReviewed) {
//     product.reviews.forEach((rev) => {
//       if (rev.user.toString() === req.user._id.toString())
//         (rev.rating = rating), (rev.comment = comment);
//     });
//   } else {
//     product.reviews.push(review);
//     product.numOfReviews = product.reviews.length;
//   }

//   let avg = 0;
//   product.reviews.forEach((rev) => {
//     avg += rev.rating;
//   });
//   product.ratings = avg / product.reviews.length;

//   await product.save({ validateBeforeSave: false });

//   res.status(200).json({
//     success: true,
//   });
// });

// exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {
//   const product = await Product.findById(req.query.id);

//   if (!product) {
//     return next(new ErrorHandler("product not found", 404));
//   }

//   res.status(200).json({
//     success: true,
//     reviews: product.reviews,
//   });
// });

// exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
//   const product = await Product.findById(req.query.productId);

//   if (!product) {
//     return next(new ErrorHandler("product not found", 404));
//   }

//   const reviews = product.reviews.filter(
//     (rev) => rev._id.toString() !== req.query.id.toString()
//   );

//   let avg = 0;
//   reviews.forEach((rev) => {
//     avg += rev.rating;
//   });

//   let ratings = 0;
//   if (reviews.length === 0) {
//     ratings = 0;
//   } else {
//     ratings = avg / reviews.length;
//   }

//   const numOfReviews = reviews.length;

//   await Product.findByIdAndUpdate(
//     req.query.productId,
//     { reviews, ratings, numOfReviews },
//     {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     }
//   );

//   res.status(200).json({
//     success: true,
//   });
// });
