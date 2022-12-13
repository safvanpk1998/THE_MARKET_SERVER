const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
var otpGenerator = require("otp-generator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxLength: [30, "name cannot exceed 30 charecter"],
    minLength: [4, "name should have 4 charecter"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    validator: [validator.isEmail, "please Enter a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please enter your Password"],
    minLength: [8, "Password should have 8 charecter"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// //JWT TOKEN

userSchema.methods.getJWTToken = function () {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.jWT_EXPIRE,
  });
};

// //compare Password

userSchema.methods.comparePassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};

// genrating passord resetting token

userSchema.methods.getResetPasswordToken = function () {
  //Genarting token
  const resetToken = crypto.randomBytes(20).toString("hex");
  const otp = Math.floor(Math.random() * 100000 + 1);

  //Hashing and adding to userSchema
  //this.resetPasswordToken = crypto
  //   .createHash("sha256")
  //   .update(resetToken)
  //   .digest("hex");

  this.resetPasswordToken = otp;

  this.resetPasswordExpire = Date.now() + 2 * 60 * 10000;

  return otp;
};

//
module.exports = mongoose.model("User", userSchema);
