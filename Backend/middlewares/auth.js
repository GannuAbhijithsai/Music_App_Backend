const jwt=require("jsonwebtoken");

module.exports=(req,res,next)=>{
    const token=req.header("x-auth-token");
    if(!token){
        return res.status(400).send({message:"Acess Denied, not token provided"});
    }

    jwt.verify(token,'meitself',(error,validToken)=>{
        if(error){
            return res.status(400).send({message:"Invalid token"});

        }else{
            req.user=validToken;
            next();
        }
    })

}