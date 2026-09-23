const express = require('express');
const upload = require('../Utils/Utils');
const authmiddleware = require('../Middelwares/Authmiddleware');
const { addArtist, showArtists, randomfive, thisartist, yourArtists } = require('../Controllers/ArtistController');
const Artistrouter = express.Router();

Artistrouter.post('/add-artist', upload.fields([
    {name: 'image', maxCount: 1},
]), authmiddleware , addArtist);

Artistrouter.get('/all-artist', showArtists);
Artistrouter.get('/five-artist', randomfive);
Artistrouter.get('/this-artist/:artistId', thisartist);
Artistrouter.get('/your-artist', authmiddleware, yourArtists);

module.exports = Artistrouter;