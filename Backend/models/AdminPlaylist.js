const mongoose=require("mongoose");
const Joi=require("joi");



const adminplaylistschema=new mongoose.Schema({
    name:
    {
        type:String,
        required:true,
        unique:true,
    },
    desc:{
        type:String,
       default:" ",
    },
    songs:{
        type:Array,
        default:[]
    },
    img:{
        type:String,
        default:"https://firebasestorage.googleapis.com/v0/b/music-app-f25d3.appspot.com/o/images%2Fplaybg.jpg?alt=media&token=b9cf7eb2-3d88-4eb0-8cdf-963643ccdc73",
    }

});

const validateA=(adminplaylist)=>{
  const schema=Joi.object({
    name:Joi.string().required(),
    desc:Joi.string().allow(),
    songs:Joi.array().items(Joi.string()),
    img:Joi.string().allow(),
  });
  return schema.validate(adminplaylist)
}

const AdminPlaylist=mongoose.model("adminplaylist",adminplaylistschema);

module.exports={AdminPlaylist,validateA};