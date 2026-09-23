const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises");
const SongModel = require("../Models/Songs");
const AlbumModel = require("../Models/Album");
const UserModel = require("../Models/User");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const addSong = async (req, res) => {
  try {
    const id = req.userId
    const {
      title,
      genre,
      category,
      language,
      duration,
      lyrics,
      releaseYear,
    } = req.body;

    if (!req.files?.coverImage || !req.files?.audioUrl) {
      return res.status(400).json({
        success: false,
        message: "Cover image and audio file are required.",
      });
    }

    const coverUpload = await cloudinary.uploader.upload(
      req.files.coverImage[0].path
    );

    const audioUpload = await cloudinary.uploader.upload(
      req.files.audioUrl[0].path,
      {
        resource_type: "video",
      }
    );
    const song = new SongModel({
      title: title.toLowerCase(),
      genre: genre.toLowerCase(),
      category: category.toLowerCase(),
      language: language.toLowerCase(),
      duration,
      coverImage: coverUpload.secure_url,
      audioUrl: audioUpload.secure_url,
      lyrics,
      addedby: id,
      releaseYear,
      createdAt: new Date(),
    });

    await song.save();

    return res.status(201).json({
      success: true,
      message: "Song added successfully.",
      song,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// show all songs
const showsong = async (req, res) => {
  try {
    const songs = await SongModel.find().pupulate("addedby", "firstname lastname")
    

    res.status(200).json(songs);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error...", success: false });
  }
};
// show songs uplaoded by you
const yoursongs = async (req, res) => {
  try {
    const user = req.userId;
    const finduser = await UserModel.findById(user);
    if (!finduser) {
      return res
        .status(404)
        .json({ message: "User not found...", success: fales });
    }
    const findSongs = await SongModel.find({
      addedby: user,
    }).sort({ createdAt: -1 });
    if (!findSongs) {
      return res
        .status(401)
        .json({ message: "No songs yet...", success: false });
    }
    res.status(200).json(findSongs);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error...", success: false });
  }
};
// add song by inside album
const albumsong = async (req, res) => {
  try {
    const { album } = req.params;
    const user = req.userId;

    const findAlbum = await AlbumModel.findOne({
      _id: album,
      createdBy: user
    });

    if (!findAlbum) {
      return res.status(404).json({
        message: "Album not found or you are not the owner...",
        success: false
      });
    }

    // Automatically get artist from album
    const artist = findAlbum.artist;

    if (!artist) {
      return res.status(404).json({
        message: "Artist not found for this album...",
        success: false
      });
    }

    const {
      title,
      genre,
      category,
      language,
      duration,
      lyrics,
      releaseYear
    } = req.body;

    if (!title || !genre || !category || !language || !duration) {
      return res.status(400).json({
        message: "Please fill in all required fields...",
        success: false
      });
    }

    if (!req.files?.coverImage || !req.files?.audioUrl) {
      return res.status(400).json({
        message: "Cover image and audio file are required...",
        success: false
      });
    }

    const coverUpload = await cloudinary.uploader.upload(
      req.files.coverImage[0].path,
      {
        resource_type: "image"
      }
    );

    const audioUpload = await cloudinary.uploader.upload(
      req.files.audioUrl[0].path,
      {
        resource_type: "video"
      }
    );

    try {
      await fs.unlink(req.files.coverImage[0].path);
      await fs.unlink(req.files.audioUrl[0].path);
    } catch (error) {
      console.log("File deletion error:", error);
    }

    const song = new SongModel({
      title: title.toLowerCase(),
      artist: artist,
      album: album,
      genre: genre.toLowerCase(),
      category: category.toLowerCase(),
      language: language.toLowerCase(),
      duration,
      coverImage: coverUpload.secure_url,
      audioUrl: audioUpload.secure_url,
      lyrics: lyrics || "",
      addedby: user,
      releaseYear
    });

    await song.save();

    return res.status(201).json({
      message: "Song added to album successfully...",
      success: true,
      song
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error...",
      success: false
    });
  }
};
// show all songs of any specific album
const showalbumsongs = async (req, res) => {
  try {
    const { albumId } = req.params;
    const songs = await SongModel.find({
      album: albumId
    }).select("title album artist genre language duration coverImage audioUrl ");
    res.status(200).json(songs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error...", success: false });
  }
};
// show random 10 songs
const randten = async (req, res) => {
  try {
    const randsongs = await SongModel.aggregate([
      {
        $sample: { size: 5 },
      },
      {
        $project: {
          title: 1,
          coverImage: 1,
          audioUrl: 1,
          genre: 1,
          category: 1,
          language: 1,
          duration: 1,
          createdAt: 1,
          _id: 1,
        },
      },
    ]);

    res.status(200).json(randsongs);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Internal server error...',
      success: false,
    });
  }
};
// Count songs of any album
const countAlbumSongs = async (req, res) => {
  try {
    const { albumId } = req.params;

    const totalSongs = await SongModel.countDocuments({
      album: albumId
    });

    return res.status(200).json({
      success: true,
      albumId,
      totalSongs
    });

  } catch (error) {
    console.error("Error counting album songs:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to count songs",
      error: error.message
    });
  }
};
const playSong = async (req, res) => {
  try {
    console.log("PARAMS:", req.params);
    console.log("SONG ID:", req.params.songId);
    const { songId } = req.params;
    console.log(songId);
    const song = await SongModel.findOne({
      _id: songId
    })
      .select("title genre language coverImage audioUrl album artist")
      .populate("album", "albumtitle")
      .populate("artist", "artistname");
    if (!song) {
      return res.status(404).json({ message: "No song found...", success: false });
    }

    res.status(200).json(song);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error...",
      success: false
    });
  }
}
module.exports = {
  addSong,
  showsong,
  yoursongs,
  albumsong,
  showalbumsongs,
  randten,
  countAlbumSongs,
  playSong
};
