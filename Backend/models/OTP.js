const mongoose=require("mongoose");
const Joi=require("joi");

const Otpschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    otp:{
        type:String,
        
    },
    created_at:{
        type:Date,
        default:new Date(),
        expires:600,
       }
});

const validateotp=(otp)=>{
    const schema=Joi.object({
        email:Joi.string().required(),
        otp:Joi.string(),
    });
    return schema.validate(otp);
};

const Otp=mongoose.model("otp",Otpschema);

module.exports={Otp,validateotp};