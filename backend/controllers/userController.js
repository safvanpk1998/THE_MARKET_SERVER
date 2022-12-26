const ErrorHandler = require("../../utils/errorhandler");
const crypto = require("crypto");
const ApiFeatures = require("../../utils/apiFeatures");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const WishList = require("../models/wishListModel");
const sendToken = require("../../utils/jwtToken");
const sendEmail = require("../../utils/sendEmail");
const sendSms = require("../../utils/sendSms");

// //Register a user

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("existing user", 404));
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilepicurl",
    },
  });
  // const token=user.getJWTToken()
  // res.status(201).json({
  //   success: true,
  //   token,
  // });
  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user has given password and email both
  // const ordeCount = await Order.countDocuments();
  // const wishlistCount = await User.findById(req.params.id).populate(
  //   "wishlistCount",
  //   "productCount"
  // );

  if (!email || !password) {
    return next(new ErrorHandler("please enter email & password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or Password", 401));
  }
  //   const isPasswordMatched = user.comparePassword(password);

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or Password", 401));
  }
  // const token=user.getJWTToken()
  // res.status(201).json({
  //   success: true,
  //   token,
  // });
  sendToken(user, 200, res);
});

//logout User

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.clearCookie('token')

  res.status(200).json({
    success: true,
    message: "logged out",
  });
});

//forgot Password

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //get reset password token

  //

  const otp =user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is:-\n\n${otp}\n\n if you hae no requested this email then, please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerse Password Recovery`,
      message,
    });
    // await sendSms()
    res.status(200).json({
      success: true,

      message: `Email sent to ${user.email} successfully `,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});


//confirm Otp

exports.confirmOtp = catchAsyncError(async (req, res, next) => {
 
  const resetPasswordToken = req.body.OTP
  const email=req.body.email

  const user = await User.findOne({
    resetPasswordToken,
   email,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("reset password token is invalid or has been expired",400)
    );
  }

  // if (req.body.password !== req.body.confirmPassword) {
  //   return next(new ErrorHandler("Password does not matched", 400));
  // }

  // user.password = req.body.password;
  user.resetPasswordToken = "OTP";
  user.resetPasswordExpire = undefined;
  res.status(200).json({
    success: true,

    message: `OTP verified  `,
  });

});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
 
  const resetPasswordToken = "OTP"
  const email=req.body.email

  const user = await User.findOne({
    // resetPasswordToken,
    email
  });

  if (!user) {
    return next(
      new ErrorHandler("Something went Wrong Please try Again")
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not matched", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//get user details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
 const  ordercount= await Order.countDocuments({user: req.user.id})
 const  Wishlistcount= await WishList.countDocuments({user: req.user.id})

  res.status(200).json({
    success: true,
    user,
    ordercount,
    Wishlistcount
    // orderNumber,
    // wishlistCount
  });
});

//update password

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is Incrorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword)
    return next(new ErrorHandler(" Password does not match", 400));

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//update profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserdata = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
  }
  let user = await User.findByIdAndUpdate(req.user.id, newUserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(201).json({
    success: true,
    user,
  });
});

//get all users(admin)

exports.getAllUser = catchAsyncError(async (req, res, next) => {


  const userCountCount = await User.countDocuments();
 
  const apiFeature = new ApiFeatures(User.find().sort({createdAt:-1}), req.query)
    .serach()
    .filter()
   // . serachByCategory()
    
  
  let filter = await apiFeature.query.clone();

  let filterdUserCount=filter.length;
  apiFeature.pagination()
  let user=await apiFeature.query
  res.status(201).json({
    success: true,
    user,
    filterdUserCount,
    userCountCount
  });
});

//get single User

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user not exist with id: ${req.params.id}`, 404)
    );
  }
  res.status(201).json({
    success: true,
    user,
  });
});

//updet user role --admin role

exports.updateProfileRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: await req.body.name,
    email: await req.body.email,
    role: await req.body.role,
  };

  let user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(201).json({
    success: true,
    user,
  });
});

//Delete user  admin

exports.deleteProfile = catchAsyncError(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user not exist with id: ${req.params.id}`, 404)
    );
  }
  await user.remove();

  res.status(201).json({
    success: true,
    user,
  });
});
