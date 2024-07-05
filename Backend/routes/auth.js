const express=require("express");
const app=express();
const cors = require("cors");
require("dotenv").config();
const {User,validate}=require("../models/user");
app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/login",async(req,res)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send({message:"Invalid email"});
    }
    if(req.body.password!=user.password){
        return res.status(401).send({message:"Invalid Password"});
    }
    const token=user.generateAuthToken();
    res.status(200).send({data:token,id:user._id,gender:user.gender,message:"Login Successful"});
})

app.post("/admin/login",async(req,res)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send({message:"Invalid email"});
    }
    if(req.body.password!=user.password){
        return res.status(401).send({message:"Invalid Password"});
    }
    if(user.isAdmin!==true){
        return res.status(403).send({message:"Your not Admin"})
    }
    const token=user.generateAuthToken();
    res.status(200).send({data:token,message:"Login Successful"});
})

module.exports=app;