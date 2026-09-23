const express = require("express");

const authmiddleware = require("../Middelwares/Authmiddleware");

const {
  getMyPlaylists,
  getPlaylistSongs,
  addPlaylist,
  addSongToPlaylist,
} = require("../Controllers/PlaylistController");

const PlaylistRouter = express.Router();

PlaylistRouter.get(
  "/my-playlists",
  authmiddleware,
  getMyPlaylists
);

PlaylistRouter.get(
  "/playlist-songs/:playlistId",
  authmiddleware,
  getPlaylistSongs
);

PlaylistRouter.post(
  "/add-playlist/:songId",
  authmiddleware,
  addPlaylist
);

PlaylistRouter.post(
  "/add-song/:playlistId/:songId",
  authmiddleware,
  addSongToPlaylist
);

module.exports = PlaylistRouter;