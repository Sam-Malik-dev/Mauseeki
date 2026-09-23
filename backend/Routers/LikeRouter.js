const express = require('express');
const { LikeSong, yourLiked, deleteLiked } = require('../Controllers/LikeController');
const likeRouter = express.Router();
const authmiddleware = require('../Middelwares/Authmiddleware')

likeRouter.post('/like/:songId',authmiddleware, LikeSong);
likeRouter.get('/yourlikes', authmiddleware, yourLiked);
likeRouter.delete('/RemoveLile/:songId', authmiddleware, deleteLiked);
module.exports = likeRouter