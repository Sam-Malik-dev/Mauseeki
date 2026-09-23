const mongoose=require('mongoose');

const ArtistSchema=mongoose.Schema({
  artistname:{
    type:String,
    required:true
  },
  dateofbirth:{
    type:Date,
    required:false
  },
  bio:{
    type:String,
    required:false
  },
  image:{
    type:String,
    required:true
  },
  genres:{
    type:String
  },
  language:{
    type:String
  },
  region:{
    type:String
  },
  createdAt:{
    type:Date
  },
  createdBy:{
    type:String,
    required:true
  }
},{timestamps:true});

const ArtistModel=mongoose.model('Artists',ArtistSchema);

module.exports=ArtistModel;