const express = require("express");
const upload = require("../Utils/Utils");
const authmiddleware = require("../Middelwares/Authmiddleware");
const {
  addSong,
  showsong,
  yoursongs,
  albumsong,
  showalbumsongs,
  randten,
  countAlbumSongs,
  playSong,
} = require("../Controllers/SongController");
const Songrouter = express.Router();
Songrouter.post(
  "/add-songs",
  authmiddleware,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioUrl", maxCount: 1 },
  ]),
  addSong,
);
Songrouter.post(
  "/album-songs/:album",
  authmiddleware,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioUrl", maxCount: 1 },
  ]),
  albumsong,
);
Songrouter.get("/album-allsongs/:albumId", showalbumsongs);
Songrouter.get("/all-songs", showsong);
Songrouter.get("/your-songs", authmiddleware, yoursongs);
Songrouter.get("/10-rand", randten);
Songrouter.get("/total-albumSongs/:albumId", countAlbumSongs);
Songrouter.get("/play/:songId", playSong);

module.exports = Songrouter;
