const PlaylistModel = require("../Models/Playlist");

const getMyPlaylists = async (req, res) => {
  try {
    const playlists = await PlaylistModel.find({
      createdBy: req.userId,
    }).populate("songs");

    return res.status(200).json({
      success: true,
      playlists,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlaylistSongs = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await PlaylistModel.findOne({
      _id: playlistId,
      createdBy: req.userId,
    }).populate("songs");

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found...",
      });
    }

    return res.status(200).json({
      success: true,
      playlist,
      songs: playlist.songs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addPlaylist = async (req, res) => {
  try {
    const user = req.userId;
    const { songId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Playlist name is required...",
      });
    }

    const playlist = await PlaylistModel.create({
      name,
      createdBy: user,
      songs: [songId],
    });

    return res.status(201).json({
      success: true,
      message: "Playlist created successfully...",
      playlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const user = req.userId;
    const { playlistId, songId } = req.params;

    const playlist = await PlaylistModel.findOne({
      _id: playlistId,
      createdBy: user,
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found...",
      });
    }

    if (playlist.songs.some((id) => id.toString() === songId)) {
      return res.status(400).json({
        success: false,
        message: "Song already exists in this playlist...",
      });
    }

    playlist.songs.push(songId);

    await playlist.save();

    return res.status(200).json({
      success: true,
      message: "Song added to playlist...",
      playlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyPlaylists,
  getPlaylistSongs,
  addPlaylist,
  addSongToPlaylist,
};