//in case of some required fields missing

module.exports=theFunc=>(req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next);
}