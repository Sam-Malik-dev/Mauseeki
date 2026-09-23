const mongoose = require('mongoose');
const LikeSchema= mongoose.Schema({
    userId :{
       type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    songId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Songs'
    }
});
const LikeModel = mongoose.model('Likes', LikeSchema);
module.exports = LikeModel;