const express=require("express");
const app=express();
const mongoose=require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/User");
const authRoutes = require("./routes/auth");
const songRoutes=require("./routes/songs");
const playlistRoutes=require("./routes/playlist");
const searchRoutes=require("./routes/search");
const AdminplaylistRoutes=require("./routes/AdminPlaylist");
app.listen(3000,()=>{
    console.log("App is listening");
})

app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
main()
.then(()=>{
    console.log("connection successful");
})
async function main(){
    await  mongoose.connect(`mongodb+srv://saigannu08:Sony24@cluster0.4kvebyg.mongodb.net/`);
 }
 app.use("/api/users/", userRoutes);
 app.use("/api/auth/",authRoutes);
 app.use("/api/songs/",songRoutes);
 app.use("/api/playlist/",playlistRoutes);
 app.use("/api/",searchRoutes);
 app.use("/api/admin/playlist/",AdminplaylistRoutes);