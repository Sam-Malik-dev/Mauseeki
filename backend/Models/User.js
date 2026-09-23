const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    VerifyCode: {
        type: String,
        required: true
    },
    profilepic: {
        type: String,
        default: 'https://res.cloudinary.com/dcri8m9sn/image/upload/v1780778097/pexels-mk_photoz-2149411980-32703420_dwmzl6.jpg',
    },
    role: {
        type: String,
        enum: ["user", "admin", "artist"],
        default: "user"
    }
}, {
    timestamps: true
});
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;