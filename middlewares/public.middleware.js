const validateToken = (req,res,next)=>{
    try{
        const token = req.headers['token']; // header keys are case-insensitive
            console.log("token", token)
            if (token && token === "yes") {
                next();
            } else {
                res.status(400).json({ success: false, message: "token not provided" });
            }
    }catch(err){
        console.log("error", err)
        res.status(500).json({success:false, message:'Iternal Server Error', error:err})
    }
};



module.exports={
    validateToken,
    // authMiddleware
}