const Product = require("../models/productSchema");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  await Product.create(req.body);
  res.status(201).json({
    success: true,
    Product,
  });
});

exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 5
  const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
  const product = await apiFeature.query;
  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateProduct = catchAsyncErrors( async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return new ErrorHandler("Product not found", 404);
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

exports.deleteProduct = catchAsyncErrors( async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return new ErrorHandler("Product not found", 404);
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

exports.getProductDetails = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return new ErrorHandler("Product not found", 404);
  }
  res.status(200).json({
    success: true,
    product,
  });
});
