const express=require("express");
const app=express();
const mongoose=require("mongoose");
const cors = require("cors");
const nodemailer = require('nodemailer');
require("dotenv").config();
const {User,validate}=require("../models/user");
const auth=require("../middlewares/auth");
const admin=require("../middlewares/admin");
const validObjectId=require("../middlewares/validObjectId");
const {Contact,validatec}=require("../models/Contatct");
const {Otp,validateotp}=require("../models/OTP");
app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/signup",async(req,res)=>{
  const {error}=validate(req.body);
  if(error){
    return res.status(400).send({message:error.details[0].message});
  }
  const user=await User.findOne({email:req.body.email});
  if(user){
    return res.status(403).send({message:"User with this email already exist"});
  }
  let newuser=await new User({
    ...req.body
  }).save();
  res.status(200).send({message:"Signup successful"});

})

app.get("/",admin,async(req,res)=>{
  const users=await User.find().select("-password");
  return res.status(200).send({data:users});
})

app.get("/:id",[validObjectId,auth],async(req,res)=>{
 const user=await User.findById(req.params.id).select("-password");
 return res.status(200).send({data:user});

})

app.put("/update/:id",[validObjectId,auth],async(req,res)=>{
  const user=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true}).select("-password");
  return res.status(200).send({data:user});
})

app.delete("/delete/:id",admin,async(req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  return res.status(200).send({message:"Successfully deleted"});
})
app.post("/contact",auth,async(req,res)=>{
  const {error}=validatec(req.body);
  if(error){
    return res.status(400).send({message:error.details[0].message});
  }
  let newmessage=await new Contact({
    ...req.body
  }).save();
  res.status(200).send({message:"Message sent Successfully"});
})



const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: `${process.env.EMAIL_KEY}`,
    pass: `${process.env.PASSWORD_KEY}`,
  },
});



app.post("/forgot",async(req,res)=>{
  const {error}=validateotp(req.body);
  if(error){
    return res.status(400).send({message:error.details[0].message});
  }
 
  const otp = Math.floor(100000 + Math.random() * 900000);
  const user=await User.findOne({"email":req.body.email});
  if(!user){
    return res.status(403).send({message:"User not found"});
  }
  const user1=await Otp.findOne({"email":req.body.email});
  if(user1){
    console.log(user1);
    await Otp.findOneAndUpdate({"email":req.body.email},{$set:{otp:otp}});
  }else{
    const user2=new Otp({
      email:req.body.email,
      otp:otp,
      expirationAfterSecond:600
    });
    await user2.save();
    
  }
  const mailOptions = {
    from: 'abhijithsai24910@gmail.com',
    to: req.body.email,
    subject: 'Forgot Password OTP',
    text: `Your OTP for resetting the password is: ${otp}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(305).json({ error: 'Error sending OTP' });
    }
    console.log('OTP sent: ' + info.response);
    res.status(200).json({ message: 'OTP sent successfully' });
  });

});

app.post("/otpverify",async(req,res)=>{
  const {error}=validateotp(req.body);
  if(error){
    return res.status(400).send({message:error.details[0].message});
  }
  const user=await Otp.findOne({"email":req.body.email});
  if(!user){
    return res.status(403).send({message:"Invalid Email"});
  }
  if(user.otp!==req.body.otp){
    return res.status(403).send({message:"Incorrect OTP"});
  }
  return res.status(200).send({message:"OTP Verified Successfully"});
});

app.post("/changepassword",async(req,res)=>{
   const user=await User.findOne({"email":req.body.email});
   if(!user){
    return res.status(400).send({message:"user not found"});
   }
   try{
   await User.findOneAndUpdate({"email":req.body.email},{$set:{password:req.body.password}});
   return res.status(200).send({message:"Password Changed Successfully"});
   }catch(error){
    res.status(500).send({message:"Internal error"});
   }
})

module.exports = app;