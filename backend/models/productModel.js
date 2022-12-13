const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
  },
  discription: {
    type: String,
    required: [true, "Please Enter Product discription"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    MaxLength: [8, "price canot excees 8 charecter"],
  },
  amountPayable: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    MaxLength: [8, "price canot excees 8 charecter"],
  },
  offer: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    MaxLength: [8, "price canot excees 8 charecter"],
    default: 0,
  },
  brand: {
    type: String,
    required: [true, "Please Enter Product brand"],
  },
  gender: {
    type: String,
    required: [true, "Please Enter Product gender"],
    default: "all",
  },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stocker",
    required: [true, "Please select Seler"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  result: {
    type: Number,
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  specs: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  subCategory: {
    type: String,
    required: [true, "Please Enter Product Sub Category"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Product stock"],
    MaxLength: [4, "price canot excees 4 charecter"],
    default: 1,
  },
  numberofReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // user:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:"user",
  //   required:true
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Product", productSchema);
