const express = require("express");


const errorMiddleware = require("./middleware/error");

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}
const cookieParser=require("cookie-parser")
const bodyParser = require("body-parser");
const fileUpload=require("express-fileupload")

const app = express();
const path=require("path")


//route imports
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload())
app.use(express.json());
app.use(cookieParser())

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const wishList = require("./routes/wishListRoute");
const stocker = require("./routes/stockersrote");
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1",order);
app.use("/api/v1",wishList);
app.use("/api/v1",stocker);
app.use(express.static(path.join(__dirname, "../client/my-app/build")))
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/my-app/build/index.html"));
});

app.get("/api/v1/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);


//middleware for error

app.use(errorMiddleware);

module.exports = app;
