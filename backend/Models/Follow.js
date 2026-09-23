const mongoose = require('mongoose');
const FollowSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artists'
    }
});
const FollowModel = mongoose.model('Followers', FollowSchema);
module.exports = FollowModel;