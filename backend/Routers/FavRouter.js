const { addToFav, yourFav, deleteFav } = require("../Controllers/FavController");
const authmiddleware = require('../Middelwares/Authmiddleware');
const express = require ('express');
const FavRouter = express.Router();

FavRouter.post('/Addtofav/:albumId', authmiddleware , addToFav);
FavRouter.get('/your-fav', authmiddleware , yourFav);
FavRouter.delete('/delete-your-fav/:album', authmiddleware, deleteFav)
module.exports = FavRouter;