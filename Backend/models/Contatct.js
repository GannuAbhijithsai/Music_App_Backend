const mongoose=require("mongoose");
const Joi=require("joi");

const contactschema=new mongoose.Schema({
    name:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true,
    },
    phonenumber:
    {
        type:String,
        required:true
    },
    message:
    {
        type:String,
        required:true
    },
    year:{
        type:String,
        required:true,
    },
    month:{
        type:String,
       required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true,
    }
});

const validatec=(contact)=>{
    const schema=Joi.object({
        name:Joi.string().required(),
        email:Joi.string().required(),
        phonenumber:Joi.string().required(),
        message:Joi.string().required(),
        year:Joi.string().required(),
        month:Joi.string().required(),
        date:Joi.string().required(),
        time:Joi.string().required()
    });
    return schema.validate(contact);
}

const Contact=mongoose.model("contact",contactschema);

module.exports={Contact,validatec};