const ErrorHandler = require("../../utils/errorhandler");
const WishList = require("../models/wishListModel");
const Product = require("../models/productModel");
const catchAsyncError = require("../middleware/catchAsyncErrors");
//create new order

exports.createNewWishList = catchAsyncError(async (req, res, next) => {
    await WishList.syncIndexes()
    let productCount = await WishList.countDocuments({user: req.user.id})
    let product = req.params.id;
    // let user=req.user.id;
    let existingUser=await WishList.find(({user: req.user.id,product:req.params.id}))
    console.log(existingUser,"exist")

    if (productCount>=10) {
      return next(new ErrorHandler("maximum Count reached", 404));
      
    }
  if (existingUser.length>0) {
    return next(new ErrorHandler("existing item", 404));
  }

  const wishlist = await WishList.create({
    

    product,
    
    
    user: req.user._id,
    
  });
  res.status(201).json({
    success: true,
    wishlist,
    
    
  });
});

//get logged in User Order

exports.myWishList = catchAsyncError(async (req, res, next) => {
    const order = await WishList.find({ user: req.user.id }).sort({createdAt:-1}).populate(
        "product",
        "name price amountPayable offer brand ratings image stock discription numberofReviews"
      )
      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
      }
      res.status(200).json({
        success: true,
        order,
      });
    });

    //delete 

    exports.deleteWishList = catchAsyncError(async (req, res, next) => {
        const wishList = await WishList.findById(req.params.id);
       
        if (!wishList) {
            return next(new ErrorHandler("Order not found with this id", 404));
          }
          await wishList.remove()
      
        res.status(200).json({
          success: true,
        
        });
      });
  
   
