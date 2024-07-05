const express=require("express");
const app=express();
const {Playlist,validate}=require("../models/Playlist");
const {User,validate1}=require("../models/user");
const {Song,validate2}=require("../models/Songs");
const auth=require("../middlewares/auth");
const {AdminPlaylist,validate3}=require("../models/AdminPlaylist");
app.get("/",auth,async(req,res)=>{
    const search=req.query.search;
    if(search!==""){
        const songs=await Song.find({
            name:{$regex:search,$options:"i"}
        }).limit(10);
        const playlists=await AdminPlaylist.find({
            name:{$regex:search,$options:"i"}
        }).limit(10);
        const result={songs,playlists};
        res.status(200).send({data:result});
    }else{
        res.status(200).send({});
    }
})
app.get("/my",auth,async(req,res)=>{
    const search=req.query.search;
    if(search!==""){
        const songs=await Song.find({
            name:{$regex:search,$options:"i"}
        }).limit(10);
        const playlists=await Playlist.find({
            name:{$regex:search,$options:"i"}
        }).limit(10);
        const result={songs,playlists};
        res.status(200).send({data:result});
    }else{
        res.status(200).send({});
    }
})

app.get("/random-songs", auth, async (req, res) => {
    const randomSongs = await Song.aggregate([
      { $sample: { size: 5 } }
    ]);
  
    res.status(200).send({ data: randomSongs });
  });
  
  app.get("/artist-songs", auth, async (req, res) => {
    const artistPlaylists = await Song.find({"artist":"Prigida"}).limit(10);
      // populate artist field with only name
  
    res.status(200).send({ data: artistPlaylists });
  });
  app.get("/most-liked-songs", auth, async (req, res) => {
    const users = await User.find().select("likedSongs"); // retrieve all users with their liked songs
    const songIds = users.reduce((acc, user) => [...acc, ...user.likedSongs], []); // flatten the liked songs array
    const songCounts = songIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {}); // count the occurrences of each song ID
  
    const topSongs = Object.keys(songCounts).sort((a, b) => songCounts[b] - songCounts[a]).slice(0, 5); // get the top 5 most liked songs
  
    const mostLikedSongs = await Song.find({ _id: { $in: topSongs } }); // retrieve the details of the top 5 most liked songs
  
    res.status(200).send({ data: mostLikedSongs });
  });
module.exports=app;