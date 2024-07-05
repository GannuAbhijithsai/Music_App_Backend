const express=require("express");
const app=express();
const {User,validing}=require("../models/user");
const {Song,validate}=require("../models/Songs");
const auth=require("../middlewares/auth");
const admin=require("../middlewares/admin");
const validObjectId=require("../middlewares/validObjectId");
const { valid } = require("joi");

app.post("/",admin,async(req,res)=>{
    const {error}=validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const song=await Song(req.body).save();
    return res.status(200).send({message:"Song created Successfully"});
})

app.get("/allsongs",async(req,res)=>{
    const songs=await Song.find();
    res.status(200).send({data:songs.reverse()});
})

app.put("/update/:id",[validObjectId,admin],async(req,res)=>{
    const song=await Song.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
    res.status(200).send({data:song,message:"Song updated"});

})

app.delete("/delete/:id",[validObjectId,admin],async(req,res)=>{
    await Song.findByIdAndDelete(req.params.id);
    res.status(200).send({message:"Song has been deleted Successfully"});
})

app.put("/like/:id",[validObjectId,auth],async(req,res)=>{
    const song=await Song.findById(req.params.id);
    let resMessage="";
    if(!song){
        return res.status(400).send({message:"song doesn't exist"});
    }
    const user=await User.findById(req.user._id);
    const index=user.likedSongs.indexOf(song._id);
    if(index===-1){
        user.likedSongs.push(song._id);
        resMessage="Added to your liked songs";
    }else{
        user.likedSongs.splice(index,1);
        resMessage="Removed from your liked songs";
    }
    await user.save();
    res.status(200).send({message:resMessage});
})

app.get("/liked",auth,async(req,res)=>{
    console.log(req.user._id);
    const user=await User.findById(req.user._id);
   console.log({user});
    const songs=await Song.find({_id:user.likedSongs});
    
    return res.status(200).send({data:songs});
})
module.exports = app;
