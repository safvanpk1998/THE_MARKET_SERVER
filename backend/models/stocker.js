const mongoose = require("mongoose");

const stockerSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  contactNumber: {
    type: Number,
    required:true
  },
  owner:{
    type:String,
    required:true
  },
  place:{
    type:String,
    required:true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Stocker", stockerSchema);
