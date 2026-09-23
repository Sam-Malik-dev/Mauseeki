const express = require('express');
const {follow, Followed, followers} = require('../Controllers/FollowController');
const authmiddleware = require('../Middelwares/Authmiddleware')
const FollowRouter = express.Router();

FollowRouter.post('/follow/:artist', authmiddleware, follow);
FollowRouter.get('/followed', authmiddleware, Followed);
FollowRouter.delete('/followers', authmiddleware, followers);

module.exports = FollowRouter