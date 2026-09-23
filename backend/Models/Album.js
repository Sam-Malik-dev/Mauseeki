const mongoose=require('mongoose');

const AlbumSchema=mongoose.Schema({
  albumtitle:{
    type:String,
    required:true
  },
  thumbnail:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  artist:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Artists',
    required:true
  },
  createdAt:{
    type:Date,
    required:true
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
},{
  timestamps:true
});

const AlbumModel=mongoose.model('Album',AlbumSchema);

module.exports=AlbumModel;