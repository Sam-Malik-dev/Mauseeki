const express = require('express');
const { addtorecent, recentlyPlayed } = require('../Controllers/RecentController');
const authmiddleware = require('../Middelwares/Authmiddleware');
const recentRouter = express.Router();

recentRouter.post('/add-recent/:songId', authmiddleware, addtorecent);
recentRouter.get('/recently-played', authmiddleware, recentlyPlayed);
module.exports = recentRouter;