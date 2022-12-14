const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
  },
  orderItems: {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    offerprize: {
      type: String,
      required: true,
    },
    offer: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userId:{
    type:String
  },
  
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    modeOfPayment: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
  },
  itemPrice: {
    type: Number,
    default: 0,
    required: true,
  },

  shippingPrice: {
    type: Number,
    default: 0,
    required: true,
  },
  amountPayable: {
    type: Number,
    default: 0,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "INR",
  },
  razorpay_order_id: {
    type: String,
  },
  razorpay_payment_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,
  },
  orderStatus: {
    type: String,
    default: "Processing",
    required: true,
  },
  dispatchedAt: Date,
  deliverdAt: Date,
  shippeddAt: Date,
  cancelledAt:Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Order", orderSchema);
