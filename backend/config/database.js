const mongoose = require("mongoose");


const connectDatabase = async() => {
  try{
    mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });

  }catch(err){
    console.log("mongoDB connection failed")
    console.log(err)
    process.exit(1);

  }
 
};

module.exports = connectDatabase;
