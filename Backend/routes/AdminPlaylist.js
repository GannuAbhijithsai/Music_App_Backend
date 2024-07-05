const express=require("express");
const app=express();
const {AdminPlaylist,validateA}=require("../models/AdminPlaylist");
const {User,validate1}=require("../models/user");
const {Song,validate2}=require("../models/Songs");
const auth=require("../middlewares/auth");
const admin=require("../middlewares/admin");
const validObjectId=require("../middlewares/validObjectId");
const Joi=require("joi");






app.post("/create",admin,async(req,res)=>{
    const {error}=validateA(req.body);
   
    if(error){
       // return res.status(400).send({message:"name of playlist is invalid"});
       return res.status(400).send({message:error.details[0].message});
    }
    const a=await AdminPlaylist.findOne({name:req.body.name});
   
    if(a){
        return res.status(403).send({message:"playlist with this name already exists"});
    }
    const playlist=await AdminPlaylist({...req.body}).save();
    

    return res.status(200).send({data:playlist});
})

app.put("/edit/:id",[validObjectId,admin],async(req,res)=>{
    const schema=Joi.object({
        name:Joi.string().required(),
        desc:Joi.string().allow(""),
        img:Joi.string().allow("")
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const playlist=await AdminPlaylist.findById(req.params.id);
    if(!playlist){
        res.status(403).send({message:"playlist not found"});
    }
 
    await AdminPlaylist.findByIdAndUpdate(req.params.id, {$set:{...req.body}} );
  
    res.status(200).send({message:"Playlist updated successfully"});
})

app.put("/add-song",admin,async(req,res)=>{
    const schema=Joi.object({
        playlistId:Joi.string().required(),
        songs:Joi.array().items(Joi.string()).required(),
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const playlist=await AdminPlaylist.findById(req.body.playlistId);
    if(!playlist){
        return res.status(403).send({message:"Playlist not found"});
    }
    let errorOccurred = false;
    req.body.songs.forEach((song) => {
        if (playlist.songs.indexOf(song) === -1) {
          playlist.songs.push(song);
        } else {
            errorOccurred = true;
          
        }
      });
      if (errorOccurred){
        return res.status(401).send({ message: "This song is already added to playlist" });
      } 
    await playlist.save();

    return res.status(200).send({data:playlist,message:"Added to playlist"});

})

app.put("/remove-song",admin,async(req,res)=>{
    const schema=Joi.object({
        playlistId:Joi.string().required(),
        songId:Joi.string().required()
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const playlist=await AdminPlaylist.findById(req.body.playlistId);
    if(!playlist){
        return res.status(403).send({message:"Playlist not found"});
    }
    
    if(playlist.songs.indexOf(req.body.songId)===-1){
       return res.status(407).send({message:"song not found"});
    }
    const index=playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index,1);
    await playlist.save();
    res.status(200).send({data:playlist,message:"Removed Playlist"})
})



app.get("/random",auth,async(req,res)=>{
    const playlist=await AdminPlaylist.aggregate([{$sample:{size:10}}]);
    res.status(200).send({data:playlist});
})

app.get("/get/:id",[validObjectId,auth],async(req,res)=>{
    const playlist=await AdminPlaylist.findById(req.params.id);
    if(!playlist){
        return res.status(200).send({message:"playlist not found"});
    }

  //  const songs=await Playlist.find({_id:playlist.songs});

    return res.status(200).send({data:{playlist}});

})

app.get("/all",auth,async(req,res)=>{
      const playlists=await AdminPlaylist.find();
     res.status(200).send({data:playlists});
})

app.delete("/delete/:id",[validObjectId,admin],async(req,res)=>{
 
    const playlist=await AdminPlaylist.findById(req.params.id);
   if(!playlist){
    return res.status(400).send({message:"Playlist not found"});
   }
     await AdminPlaylist.findByIdAndDelete(req.params.id)
     res.status(200).send({message:"Removed from library"})
})
module.exports=app;