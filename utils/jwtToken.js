//Create token and saving in cookie

const sendToken=(user,statusCode,res)=>{
    const token=user.getJWTToken()

    //option for cookie

    const option={
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        )
        , secure:process.env.NODE_ENV !== "PRODUCTION"
        ,httpOnly:true,
        sameSite: 'none',
    
        
    };
    res.status(statusCode).cookie('token',token,option).json({
        success:true,
        user,
        token
        
    })
};
module.exports=sendToken