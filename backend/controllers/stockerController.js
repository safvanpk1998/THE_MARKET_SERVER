const ErrorHandler = require("../../utils/errorhandler");
const Stocker = require("../models/stocker");
const catchAsyncError = require("../middleware/catchAsyncErrors");
//create new order

exports.createNewstocker = catchAsyncError(async (req, res, next) => {
  const { name, owner, contactNumber, place } = req.body;

  let stockerCount = await Stocker.countDocuments();
  let existingStocker = await Stocker.find({
    name: req.body.name,
    place: req.body.place,
  });


  if (existingStocker.length > 0) {
    return next(new ErrorHandler("existing item", 404));
  }
  const stocker = await Stocker.create({
    contactNumber,
  
    name,
    owner,
    place,
    createdBy:req.user._id
  });

  res.status(201).json({
    success: true,
    stocker,
    stockerCount,
   
  });
});

//get logged in User Order

exports.AllStockers = catchAsyncError(async (req, res, next) => {
    const stockers = await Stocker.find();
  
    res.status(200).json({
      success: true,
      stockers,
    });
  });

//delete

exports.deletestockert = catchAsyncError(async (req, res, next) => {
  const stocker = await Stocker.findById(req.params.id);

  if (!stocker) {
    return next(new ErrorHandler("stocker not found with this id", 404));
  }
  await stocker.remove();

  res.status(200).json({
    success: true,
  });
});
