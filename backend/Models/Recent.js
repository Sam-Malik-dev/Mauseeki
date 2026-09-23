const mongoose= require('mongoose');
const RecentSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    songId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Songs',
        required: true
    },
    playedAt: {
        type: String,
      required: true,
      default: () =>
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    }
},{timestamps: true});

const RecentModel = mongoose.model('RecentlyPlayed', RecentSchema);
module.exports = RecentModel;