const express = require('express');
const upload = require('../Utils/Utils');
const { signup, login, currentUser, signout, updateProfile } = require('../Controllers/UserController');
const authmiddleware = require('../Middelwares/Authmiddleware');
const Userrouter = express.Router();
Userrouter.post(
    "/sign-up",
    upload.fields([
        { name: "profilepic", maxCount: 1 }
    ])
    ,
    signup
);
Userrouter.post('/log-in', login);
Userrouter.get('/you', authmiddleware , currentUser);
Userrouter.delete('/singout', authmiddleware, signout);
Userrouter.put(
    '/update-profile',
    authmiddleware,
    upload.fields([
        { name: "profilepic", maxCount: 1 }
    ]),
    updateProfile
);
module.exports = Userrouter