const ErrorHandler = require("../../utils/errorhandler");
const Order = require("../models/orderModel");
const ApiFeatures = require("../../utils/apiFeatures");
const Product = require("../models/productModel");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const Razorpay = require('razorpay');
const crypto = require("crypto");

//create new order

exports.createNewOrder = catchAsyncError(async (req, res, next) => {
  const razorpayInstance = new Razorpay({
  
    // Replace with your key_id
    key_id: process.env.RAZORPAY_API_KEY,
  
    // Replace with your key_secret
    key_secret: process.env.RAZORPAY_APT_SECRET
});
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    amountPayable,
    shippingPrice,
    amount= Number(req.body.amountPayable),
    currency= "INR",
  
   
  } = req.body;

  if (paymentInfo.modeOfPayment==="cashOnDelivery"){
  
    const order = await Order.create({

    
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      amountPayable,
      shippingPrice,
     
      

      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      order,
    });

  }
  if (paymentInfo.modeOfPayment==="direct"){
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    const order = await Order.create({

      amount,
      currency,
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        amountPayable,
        shippingPrice,
        
    
        paidAt: Date.now(),
        user: req.user._id,
      });
      res.status(201).json({
        success: true,
        order,
      });
  }
  if (!isAuthentic) {
    return next(new ErrorHandler("Payment Not Success, Please try again", 404));
  }
   
   

  }

  

});


//razorpay payment gate way

exports.razorpayPayment = catchAsyncError(async (req, res, next) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
  });
  const options = {
    amount: req.body.amount,
    currency: 'INR',
  };
  const order = await instance.orders.create(options);
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});


//get single Order

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).sort({createdAt:-1}).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

//get logged in User Order

exports.myOrder = catchAsyncError(async (req, res, next) => {
  const myorder = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    myorder,
  });
});

//get all orders

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
 
  let amountPayable = 0;
  let allOrders=await Order.find()

  allOrders.forEach((odr) => {
    amountPayable += odr.amountPayable;
  });
  
  const orderCount = await Order.countDocuments();
 
  const apiFeature = new ApiFeatures(Order.find().sort({createdAt:-1}), req.query)
    .serach()
    .filter()
   // . serachByCategory()
    

  let filter = await apiFeature.query.clone();

  let filterdOrderCount=filter.length;

 
  apiFeature.pagination()
  let orders=await apiFeature.query

  res.status(200).json({
    success: true,
    orders,
    orderCount,
    filterdOrderCount,
    amountPayable,
  });
});

//update ordder status

exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
 
  let productId=order.orderItems.product
  let quantity=order.orderItems.quantity
 
  
    await updateStoke(productId, quantity);
    if (req.body.status === "Delivered" ) {
      if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Order allready Delivered", 400));
      }
      if (req.body.paymentInfo.payment==="Fail") {
        return next(new ErrorHandler("payment Not completed", 400));
      }
      order.orderStatus = req.body.status;
      order.deliverdAt = Date.now();
      order.paidAt = Date.now();
    }
 

 
  if (req.body.status === "Shipped") {
    if (order.orderStatus === "Shipped") {
      return next(new ErrorHandler("You all ready Shipped this product", 400));
    }
    order.shippeddAt = Date.now();
    order.orderStatus = req.body.status;
  }


  if (req.body.status === "Cancelled") {
    if (order.orderStatus === "Cancelled") {
      return next(new ErrorHandler("Order cancelled", 400));
    }
    if (order.orderStatus === "Delivered") {
      return next(new ErrorHandler("Order allready Delivered", 400));
    }
    order.cancelledAt = Date.now();
    order.orderStatus = req.body.status;
  }

  if (req.body.status === "Dispatched") {
    if (order.orderStatus === "Dispatched") {
      return next(new ErrorHandler("Order Dispatched", 400));
    }
    order.dispatchedAt = Date.now();
    order.orderStatus = req.body.status;
  }

 

  await order.save({
    validateBeforeSave: false,
  });
  res.status(200).json({
    success: true,
    order
  });
});


async function updateStoke(id,quantity){

    const product=await Product.findById(id);
    product.stock= product.stock-quantity
    await product.save({
        validateBeforeSave: false,
      });


}


//delete order

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const orders = await Order.findById(req.params.id);
   
    if (!orders) {
        return next(new ErrorHandler("Order not found with this id", 404));
      }
      await orders.remove()
  
    res.status(200).json({
      success: true,
    
    });
  });