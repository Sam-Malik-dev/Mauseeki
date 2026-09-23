const express = require('express');
const authmiddleware = require('../Middelwares/Authmiddleware');
const { contact } = require('../Controllers/ContactController');
const ContactRouter = express.Router();
ContactRouter.post('/Contact', authmiddleware, contact)
module.exports = ContactRouter;