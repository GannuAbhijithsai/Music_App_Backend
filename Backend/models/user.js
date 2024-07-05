const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const Joi=require("joi");
const passwordComplexity=require("joi-password-complexity");

const Userschema=new mongoose.Schema({
    name:
    {
        type:String,
        required:true

    },
    email:
    {
        type:String,
        required:true,
        unique:true
    },
    password:
    {
        type:String,
        required:true,
    },
    month:
    {
        type:String,
        required:true,
    },
    date:
    {
        type:String,
        required:true,
    },
    year:
    {
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    likedSongs:
    {
        type:[String],
        default:[]
    },
    playlist:
    {
        type:[[]],
        default:[]
        
    },
    isAdmin:{
        type:Boolean,
        default:false
    }

})

Userschema.methods.generateAuthToken=function(){
    const token=jwt.sign(
        {_id:this._id,name:this.name,isAdmin:this.isAdmin},
        'meitself',
        {expiresIn:"30d"}

    )
    return token;
}

const validate=(user)=>{
    const schema=Joi.object({
        name:Joi.string().min(3).max(32).required(),
        email:Joi.string().email().required(),
        password:passwordComplexity().required(),
        month:Joi.string().required(),
        date:Joi.string().required(),
        year:Joi.string().required(),
        gender:Joi.string().valid("male","female","non-binary").required(),
        isAdmin:Joi.boolean(),

    });
    return schema.validate(user);
}
const User=mongoose.model("user",Userschema);

module.exports={User,validate}