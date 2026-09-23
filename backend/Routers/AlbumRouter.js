const express = require("express");
const upload = require("../Utils/Utils");
const authmiddleware = require("../Middelwares/Authmiddleware");
const { addAlbum, showalbum, addartistalbum, showartistalbum, randomfive, thisalbum, yourAlbum } = require("../Controllers/AlbumController");
const AlbumRouter = express.Router();

AlbumRouter.post(
  "/add-album",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  authmiddleware,
  addAlbum,
);
AlbumRouter.post(
  "/artist-album/:artists",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  authmiddleware,
  addartistalbum
);
AlbumRouter.get('/artist-alb/:artists', showartistalbum);
AlbumRouter.get('/all-album', showalbum);
AlbumRouter.get('/rand-album', randomfive);
AlbumRouter.get('/this-album/:albumId', thisalbum);
AlbumRouter.get('/your-albums', authmiddleware, yourAlbum)

module.exports = AlbumRouter;
