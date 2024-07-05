const express=require("express");
const app=express();
const {Playlist,validate}=require("../models/Playlist");
const {User,validate1}=require("../models/user");
const {Song,validate2}=require("../models/Songs");
const auth=require("../middlewares/auth");
const admin=require("../middlewares/admin");
const validObjectId=require("../middlewares/validObjectId");
const Joi=require("joi");






app.post("/create",auth,async(req,res)=>{
    const {error}=validate(req.body);
   
    if(error){
       // return res.status(400).send({message:"name of playlist is invalid"});
       return res.status(400).send({message:error.details[0].message});
    }
    const user=await User.findById(req.user._id);
    const playlist=await Playlist({...req.body,user:user._id}).save();
    await user.save();

    return res.status(200).send({data:playlist});
})

app.put("/edit/:id",[validObjectId,auth],async(req,res)=>{
    const schema=Joi.object({
        name:Joi.string().required(),
        desc:Joi.string().allow(""),
        img:Joi.string().allow("")
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const playlist=await Playlist.findById(req.params.id);
    if(!playlist){
        res.status(403).send({message:"playlist not found"});
    }
    const user=await User.findById(req.user._id);
    if(req.user._id!==`${playlist.user}`){
       return res.status(404).send({message:"User don't have access to it"});
    }
    await Playlist.findByIdAndUpdate(req.params.id, {$set:{...req.body}} );
  
    res.status(200).send({message:"Playlist updated successfully"});
})

app.put("/add-song",auth,async(req,res)=>{
    const schema=Joi.object({
        playlistId:Joi.string().required(),
        songId:Joi.string().required()
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const playlist=await Playlist.findById(req.body.playlistId);
    if(!playlist){
        return res.status(403).send({message:"Playlist not found"});
    }
    const user=await Song.findById(req.user._id);
    if(req.user._id!==`${playlist.user}`){
        return res.status(404).send({message:"You don't have access "});
    }
    if(playlist.songs.indexOf(req.body.songId)===-1){
        playlist.songs.push(req.body.songId);
    }else{
        return res.status(407).send({message:"This song is already added to playlist"})
    }
    await playlist.save();

    return res.status(200).send({data:playlist,message:"Added to playlist"});

})

app.put("/remove-song",auth,async(req,res)=>{
    const schema=Joi.object({
        playlistId:Joi.string().required(),
        songId:Joi.string().required()
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const playlist=await Playlist.findById(req.body.playlistId);
    if(!playlist){
        return res.status(403).send({message:"Playlist not found"});
    }
    const user=await Song.findById(req.user._id);
    if(req.user._id!==playlist.user.toString()){
        return res.status(404).send({message:"You don't have access "});
    }
    if(playlist.songs.indexOf(req.body.songId)===-1){
       return res.status(407).send({message:"song not found"});
    }
    const index=playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index,1);
    await playlist.save();
    res.status(200).send({data:playlist,message:"Removed Playlist"})
})

app.get("/favourite",auth,async(req,res)=>{
    const user=await User.findById(req.user._id);
    const playlist=await Playlist.find({_id:user.playlist});
    res.status(200).send({data:playlist});
})

app.get("/random",auth,async(req,res)=>{
    const playlist=await Playlist.aggregate([{$sample:{size:10}}]);
    res.status(200).send({data:playlist});
})

app.get("/get/:id",[validObjectId,auth],async(req,res)=>{
    const playlist=await Playlist.findById(req.params.id);
    if(!playlist){
        return res.status(200).send({message:"playlist not found"});
    }

  //  const songs=await Playlist.find({_id:playlist.songs});

    return res.status(200).send({data:{playlist}});

})

app.get("/all",auth,async(req,res)=>{
      const playlists=await Playlist.find();
     res.status(200).send({data:playlists});
})

app.delete("/delete/:id",[validObjectId,auth],async(req,res)=>{
    const user=await User.findById(req.user._id);
    const playlist=await Playlist.findById(req.params.id);
    if(req.user._id!==`${playlist.user}`){
        return res.status(404).send({message:"You don't have access "});
    }
    const index=user.playlist.indexOf(req.params.id);
     user.playlist.splice(index,1);
     await user.save();
     await Playlist.findByIdAndDelete(req.params.id)
     res.status(200).send({message:"Removed from library"})
})
module.exports=app;