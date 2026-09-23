const express = require("express");
require("dotenv").config();
require("./Models/DB");

const cors = require("cors");

const Userrouter = require("./Routers/UserRouter");
const Songrouter = require("./Routers/SongRouter");
const Artistrouter = require("./Routers/ArtistRouter");
const AlbumRouter = require("./Routers/AlbumRouter");
const LikeRouter = require("./Routers/LikeRouter");
const FavRouter = require("./Routers/FavRouter");
const FollowRouter = require("./Routers/FollowRouter");
const AdminRouter = require("./Routers/AdminRouter");
const ContactRouter = require("./Routers/ContactRouter");
const router = require("./Routers/SearchRouter");
const recentRouter = require("./Routers/RecentRouter");
const PlaylistRouter = require("./Routers/PlaylistRouter");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/Mauseeki", Userrouter);
app.use("/Mauseeki", Songrouter);
app.use("/Mauseeki", Artistrouter);
app.use("/Mauseeki", AlbumRouter);
app.use("/Mauseeki", LikeRouter);
app.use("/Mauseeki", FavRouter);
app.use("/Mauseeki", FollowRouter);
app.use("/Mauseeki", AdminRouter);
app.use("/Mauseeki", ContactRouter);
app.use("/Mauseeki", router);
app.use("/Mauseeki", recentRouter);
app.use("/Mauseeki", PlaylistRouter);


app.get("/", (req, res) => {
    res.send("Mauseeki Backend API is Running");
});


// FOR VERCEL
module.exports = app;