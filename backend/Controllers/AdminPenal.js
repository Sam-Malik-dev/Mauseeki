const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const SongModel = require("../Models/Songs");
const AlbumModel = require("../Models/Album");
const ArtistModel = require("../Models/Artist");
const ContactModel = require('../Models/Contact')

const AdminLogin = async (req, res) => {
    try {
        const { email, password, VerifyCode } = req.body;

        // Find user
        const user = await UserModel.findOne({ email: email, VerifyCode: VerifyCode });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check password
        const verifyPass = await bcrypt.compare(
            password,
            user.password
        );

        if (!verifyPass) {
            return res.status(401).json({
                message: "Wrong password",
                success: false
            });
        }

        // Change role to admin
        user.role = "admin";

        await user.save();

        // Create JWT
        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d"
            }
        );

        return res.status(200).json({
            message: "Login successful. You are now admin.",
            success: true,
            token: token,
            user: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("ADMIN LOGIN ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
const totalUsers = async (req, res) => {
    try {
        const users = await UserModel.countDocuments();
        res.status(200).json(users)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error...", success: false });
    }
};
const totalSongs = async (req, res) => {
    try {
        const songs = await SongModel.countDocuments();
        res.status(200).json(songs)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error...", success: false });
    }
};
const totalAlbums = async (req, res) => {
    try {
        const albums = await AlbumModel.countDocuments();
        res.status(200).json(albums)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error...", success: false });
    }
};
const totalArtists = async (req, res) => {
    try {
        const artists = await ArtistModel.countDocuments();
        res.status(200).json(artists)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error...", success: false });
    }
};
const RecentUsers = async (req, res) => {
    try {
        const users = await UserModel.find()
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error...", success: false });
    }
};
const Recentsongs = async (req, res) => {
    try {
        const users = await SongModel.find()
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error...", success: false });
    }
};
const Recentalbums = async (req, res) => {
    try {
        const users = await AlbumModel.find()
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error...", success: false });
    }
};
const Recentartists = async (req, res) => {
    try {
        const users = await ArtistModel.find()
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error...", success: false });
    }
};
const deleteSong = async (req, res) =>{
    try {
        const {songId} = req.params;
        const deletesong = await SongModel.findByIdAndDelete({
            _id: songId
        });
        if(!deletsong){
            return res.status(401).json({message: "There was a problem while deleting it...", success:false});
        }
        res.status(200).json({messge: "Song deleted...", success:true});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error...", success:false});
    }
};
const allusers = async (req, res) =>{
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error...", success:false});
    }
};
const allcontacts = async (req, res) =>{
    try {
        const contacts = await ContactModel.find();
        res.status(200).json(contacts)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    AdminLogin,
    totalUsers,
    totalSongs,
    totalAlbums,
    totalArtists,
    RecentUsers,
    Recentsongs,
    Recentartists,
    Recentalbums,
    deleteSong,
    allusers,
    allcontacts
};