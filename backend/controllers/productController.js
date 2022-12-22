const ErrorHandler = require("../../utils/errorhandler");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../../utils/apiFeatures");
const cloudinary = require("cloudinary");

//create product

exports.createProduct = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "products",
    // width:300,
    // crop:"scale"
  });

  req.body.image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  let amountPayable = req.body.price;
  if (req.body.offer > 0) {
    let OfferPrice = (Number(req.body.price) / 100) * Number(req.body.offer);
    amountPayable =Math.round(Number(req.body.price) - OfferPrice) ;
  }

  req.body.amountPayable = amountPayable;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

exports.getAllProduct = catchAsyncError(async (req, res, next) => {
 
  // const userid= req.user.id

  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(
    Product.find().sort({ createdAt: -1 }),
    req.query
  )
    .serach()
    .filter();

  let filter = await apiFeature.query.clone();

  apiFeature.pagination();

  let products = await apiFeature.query.populate(
    "soldBy",
    "name place"
  );;
  let ProductCount = products.length;

  let filterdProductCount = filter.length;

  res.status(201).json({
    success: true,
    products,
    productCount,
    filterdProductCount,
    ProductCount,
  });
});

//update product

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let products = await Product.findById(req.params.id);
  if (!products) {
    return next(new ErrorHandler("product not found", 404));
  }

  await cloudinary.v2.uploader.destroy(Product.images[0].public_id);

  const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "products",
    // width:300,
    // crop:"scale"
  });

  req.body.image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  let amountPayable = req.body.price;
  if (req.body.offer > 0) {
    let OfferPrice = (Number(req.body.price) / 100) * Number(req.body.offer);
    amountPayable = Number(req.body.price) - OfferPrice;
  }

  req.body.amountPayable = amountPayable;
  products = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(201).json({
    success: true,
    products,
  });
});

//get product details

exports.productDetais = catchAsyncError(async (req, res, next) => {
  let products = await Product.findById(req.params.id).populate(
    "soldBy",
    "name place"
  );;;
  if (!products) {
    return next(new ErrorHandler("product not found", 404));
  }

  res.status(201).json({
    success: true,
    products,
  });
});

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let products = await Product.findById(req.params.id);
  if (!products) {
    return next(new ErrorHandler("product not found", 404));
  }
  products = await Product.deleteMany({
    _id: req.params.id,
  });
  res.status(201).json({
    success: true,
    message: "product deleted successfully",
  });
});

//create product review or update the review

exports.reviewProduct = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment,
  };

  const product = await Product.findById(req.body.productId);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  const isReviwd = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  );

  if (isReviwd) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numberofReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = Number((avg / product.reviews.length).toFixed(2));

  await product.save({
    validateBeforeSave: false,
  });
  res.status(200).json({
    success: true,
  });
});

//get all reviews of a single product

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  let products = await Product.findById(req.query.id).sort({ ratings: "desc" });
  if (!products) {
    return next(new ErrorHandler("product not found", 404));
  }

  res.status(201).json({
    success: true,
    reviews: products.reviews,
  });
});

//delete review
exports.deletetReviews = catchAsyncError(async (req, res, next) => {
  let products = await Product.findById(req.query.productId);

  if (!products) {
    return next(new ErrorHandler("product not found", 404));
  }
  // const reviews = products.reviews.filter(

  //   (rev) => rev._id.toString() !== req.query.id.toString(),
  //   // console.log(rev._id)
  // );

  var newReview = products.reviews.filter(function (el) {
    // console.log(el._id.toString(), "review id");
    // console.log(req.query.id.toString(), "queryparam");

    return el._id.toString() !== req.query.id.toString();
    //  el.RollNumber <= 200 &&
    //  el.Marks >= 80 ;
  });
  // console.log(newReview, "newreview");

  let avg = 0;

  newReview.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / newReview.length;
  numberofReviews = newReview.length;
  reviews = newReview;

  const body = {
    reviews,
    ratings,
    numberofReviews,
    result,
  };

  products = await Product.findByIdAndUpdate(req.query.productId, body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(201).json({
    success: true,
    products,
  });
});
