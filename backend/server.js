const app=require("./app")

const cloudinary=require("cloudinary")
// import Razorpay from "razorpay";
const connectDatabase=require("./config/database")



//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
  }
  
//connecting to database

connectDatabase()
const server =app.listen(process.env.PORT,()=>{
})

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})



//handling uncaught Exception

process.on("uncaughtException",err=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to handling uncaught Exception`)
server.close(()=>{
    process.exit(1)
});
});



// console.log(youtube)




//unhandeled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to Unhandled Promise Rejection`)
server.close(()=>{
    process.exit(1)
});
});
