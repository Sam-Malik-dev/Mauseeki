const express = require('express');
const {AdminLogin, totalUsers, totalSongs, totalArtists, totalAlbums, RecentUsers , Recentsongs, Recentartists, Recentalbums, deleteSong, allusers, allcontacts} = require('../Controllers/AdminPenal');
const AdminRouter = express.Router();

AdminRouter.post('/admin-login', AdminLogin);
AdminRouter.get('/total-Users', totalUsers);
AdminRouter.get('/total-songs', totalSongs);
AdminRouter.get('/total-artists', totalArtists);
AdminRouter.get('/total-albums', totalAlbums);
AdminRouter.get('/recent-users', RecentUsers);
AdminRouter.get('/recent-songs', Recentsongs);
AdminRouter.get('/recent-artists', Recentartists);
AdminRouter.get('/recent-albums', Recentalbums);
AdminRouter.delete('/delete-song/:songId', deleteSong);
AdminRouter.get('/allusers', allusers);
AdminRouter.get('/messages', allcontacts)
module.exports = AdminRouter;