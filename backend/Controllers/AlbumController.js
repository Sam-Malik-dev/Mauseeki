const cloudinary = require('cloudinary');
const fs = require('fs/promises');
const UserModel = require('../Models/User');
const ArtistModel = require('../Models/Artist');
const AlbumModel = require('../Models/Album');
const SongModel = require('../Models/Songs');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const addAlbum = async (req, res) => {
  try {
    const id = req.userId;

    const checkuser = await UserModel.findById(id);

    if (!checkuser) {
      return res.status(404).json({
        message: "User not found...",
        success: false
      });
    }

    const { albumtitle, description, artistname } = req.body;

    if (!albumtitle || !description) {
      return res.status(400).json({
        message: "Album title and description are required.",
        success: false
      });
    }

   let image = "";

if (req.files && req.files.thumbnail) {
    const pic = req.files.thumbnail[0];

    console.log("FILE INFO:", pic);

    try {
        const uploaded = await cloudinary.uploader.upload(
            pic.path,
            {
                resource_type: "image"
            }
        );

        console.log("CLOUDINARY URL:", uploaded.secure_url);

        image = uploaded.secure_url;

        try {
            fs.unlinkSync(pic.path);
        } catch (error) {
            console.log("FILE DELETE ERROR:", error);
        }

    } catch (error) {
        console.log("CLOUDINARY ERROR:", error);

        return res.status(400).json({
            message: "Thumbnail upload failed",
            success: false,
            error: error.message
        });
    }
}

    let artistId;

    if (artistname) {
      const checkartist = await ArtistModel.findOne({
        artistname: artistname.toLowerCase(),
        createdBy: id
      });

      if (!checkartist) {
        return res.status(404).json({
          message: "You have not added this artist yet...",
          success: false
        });
      }

      artistId = checkartist._id;
    } else {
      let userArtist = await ArtistModel.findOne({
        createdBy: id
      });

      if (!userArtist) {
        userArtist = await ArtistModel.create({
          artistname: `${checkuser.firstname} ${checkuser.lastname}`,
          bio: "",
          image: checkuser.profilepic || "",
          createdBy: id
        });
      }

      artistId = userArtist._id;
    }

    const album = new AlbumModel({
      albumtitle: albumtitle.toLowerCase(),
      thumbnail: image,
      description: description.toLowerCase(),
      artist: artistId,
      createdBy: id,
      createdAt: Date.now()
    });

    await album.save();

    res.status(201).json({
      message: "Album added successfully.",
      success: true
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error...",
      success: false
    });
  }
};

const addartistalbum = async (req, res) => {
  try {
    const user = req.userId;
    const { artists } = req.params;

    if (!artists) {
      return res.status(400).json({
        message: "Artist not provided...",
        success: false
      });
    }

    const userid = await UserModel.findById(user);

    if (!userid) {
      return res.status(404).json({
        message: "User not found...",
        success: false
      });
    }

    const { albumtitle, description } = req.body;

    if (!albumtitle || !description) {
      return res.status(400).json({
        message: "Album title and description are required...",
        success: false
      });
    }

    let image = "";

    if (req.files && req.files.thumbnail) {
      const pic = req.files.thumbnail[0];

      const uploaded = await cloudinary.uploader.upload(pic.path, {
        resource_type: "auto"
      });

      image = uploaded.secure_url;

      try {
        await fs.unlink(pic.path);
      } catch (error) {
        console.log(error);
      }
    }

    const album = new AlbumModel({
      albumtitle: albumtitle.toLowerCase(),
      description: description.toLowerCase(),
      thumbnail: image,
      createdBy: user,
      createdAt: Date.now(),
      artist: artists
    });

    await album.save();

    return res.status(201).json({
      message: "Album added successfully...",
      success: true,
      album
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error...",
      success: false
    });
  }
};

const showartistalbum = async (req, res) => {
  try {
    const { artists } = req.params;

    if (!artists) {
      return res.status(404).json({
        message: "Artist not provided...",
        success: false
      });
    }

    const findartist = await AlbumModel.find({
      artist: artists
    })
      .populate("artist", "artistname")
      .select("_id albumtitle thumbnail description artist");

    console.log("ALBUM DATA:", JSON.stringify(findartist, null, 2));

    res.status(200).json(findartist);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error...",
      success: false
    });
  }
};
const showalbum = async (req, res) => {
  try {
    const allalbums = await AlbumModel.find().populate("artist", "artistname");
    res.status(200).json(allalbums);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const randomfive = async (req, res) => {
  try {
    const randalbum = await AlbumModel.aggregate([
      {
        $sample: { size: 5 },
      },
      {
        $project: {
          albumtitle: 1,
          thumbnail: 1,
          description: 1,
          artist: 1,
          createdAt: 1,
          catagory: 1,
          _id: 1,
        },
      },
    ]);
    res.status(200).json(randalbum);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error...", success: false });
  }
};

const deletyourAlbum = async (req, res) => {
  try {
    const user = req.userId;
    const { albumId } = req.params;

    // Find album belonging to logged-in user
    const album = await AlbumModel.findOneAndDelete({
      _id: albumId,
      createdBy: user,
    });

    if (!album) {
      return res.status(404).json({
        message: "Album not found or unauthorized...",
        success: false,
      });
    }

    // Delete all songs belonging to this album
    await SongModel.deleteMany({
      albumId: albumId,
    });

    res.status(200).json({
      message: "Album and its songs deleted...",
      success: true,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error...",
      success: false,
    });
  }
};

const viewyourAlbum = async (req, res) => {
  try {
    const { album } = req.params;
    console.log(album);
    const finddata = await AlbumModel.findById(album)
      .select("albumtitle thumbnail description artist");
    res.status(200).json(finddata);
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Internal server error...", success: false });
  }
};

const deletealbumSong = async (req, res) => {
  try {
    const user = req.userId;
    const { albumId, songId } = req.params;

    // Check album belongs to logged-in user
    const album = await AlbumModel.findOne({
      _id: albumId,
      createdBy: user,
    });

    if (!album) {
      return res.status(404).json({
        message: "Album not found or unauthorized...",
        success: false,
      });
    }

    // Find and delete the song
    const song = await SongModel.findOneAndDelete({
      _id: songId,
      albumId: albumId,
    });

    if (!song) {
      return res.status(404).json({
        message: "Song not found in this album...",
        success: false,
      });
    }

    res.status(200).json({
      message: "Song removed from album successfully...",
      success: true,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error...",
      success: false,
    });
  }
};
const thisalbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    console.log(albumId);
    const findalbum = await AlbumModel.findOne({
      _id: albumId
    })
      .select("albumtitle thumbnail description ")
      .populate("artist", "artistname");
    if (!findalbum) {
      return res.status(404).json({ message: "No ablum found...", success: false });
    }

    res.status(200).json(findalbum);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error...", success: false });
  }
};
const yourAlbum = async (req, res) => {
  try {
    const user = req.userId;

    const albums = await AlbumModel.find({
      createdBy: user
    }).select("albumtitle thumbnail description");

    res.status(200).json(albums);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error...",
      success: false
    });
  }
};

module.exports = {
  addAlbum,
  showalbum,
  randomfive,
  deletyourAlbum,
  viewyourAlbum,
  deletealbumSong,
  addartistalbum,
  showartistalbum,
  thisalbum,
  yourAlbum
}