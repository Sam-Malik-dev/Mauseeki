const mongoose = require('mongoose');
const favSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    albumId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    },
});

const FavModel = mongoose.model('Favs', favSchema);
module.exports = FavModel;