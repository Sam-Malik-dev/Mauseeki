const cloudinary = require("cloudinary");
const fs = require("fs/promises");
const UserModel = require('../Models/User');
const ArtistModel = require("../Models/Artist");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const addArtist = async (req, res) => {
  try {
    const id = req.userId;

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found...",
        success: false
      });
    }

    const {
      artistname,
      dateofbirth,
      bio,
      genres,
      language,
      region
    } = req.body;

    if (!artistname || !dateofbirth || !bio) {
      return res.status(400).json({
        message: "Please fill in all required fields...",
        success: false
      });
    }

    let img = "";

    if (req.files && req.files.image) {
      const picture = req.files.image[0];

      const uploaded = await cloudinary.uploader.upload(picture.path, {
        resource_type: "auto"
      });

      img = uploaded.secure_url;

      try {
        await fs.unlink(picture.path);
      } catch (error) {
        console.log(error);
      }
    }

    if (!img) {
      return res.status(400).json({
        message: "Artist image is required...",
        success: false
      });
    }

    const artist = new ArtistModel({
      artistname: artistname.toLowerCase(),
      dateofbirth,
      bio: bio.toLowerCase(),
      genres: genres ? genres.toLowerCase() : "",
      language: language ? language.toLowerCase() : "",
      region: region ? region.toLowerCase() : "",
      image: img,
      createdBy: id
    });

    await artist.save();

    return res.status(201).json({
      message: "Artist added successfully...",
      success: true,
      artist
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error...",
      success: false
    });
  }
};

const showArtists = async (req, res)=>{
    try {
        const allartists = await ArtistModel.find();
        res.status(200).json(allartists);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error...", success:false});
    }
};


const yourArtists = async (req, res)=>{
    try {
        const user = req.userId;
        const findyourartist = await ArtistModel.find({
            createdBy: user
        })
        .select("artistname dateofbirth image genres language region");
        res.status(200).json(findyourartist)
    } catch (error) {
          console.log(error);
        res.status(500).json({message: "Internal server error", success:false});
    }
};

const deleteYourArtist = async (req , res)=>{
    try {
        const user = req.userId;
        const deleteartist = await ArtistModel.findByIdAndDelete({
            createdBy: user
        });
        res.status(200).json({message: "Artist Deleted...", success:true});
    } catch (error) {
          console.log(error);
        res.status(500).json({message: "Internal server error", success:false});
    }
};

const randomfive = async (req, res) => {
  try {
    const randalbum = await ArtistModel.aggregate([
      {
        $sample: { size: 5 },
      },
      {
        $project: {
          artistname: 1,
          dateofbirth: 1,
          image: 1,
          bio: 1,
          genres: 1,
          language: 1,
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

const thisartist = async (req, res) =>{
  try {
    const {artistId} = req.params;
    console.log(artistId);
    const findartist = await ArtistModel.findOne({
      _id: artistId
    })
    .select("artistname bio image  language region ");
    if(!findartist){
      return res.status(404).json({message: "Artist not found...", success:false});
    }

    res.status(200).json(findartist);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error...",success:false});
  }
}
module.exports = {
    addArtist,
    showArtists,
    yourArtists,
    deleteYourArtist,
    randomfive,
    thisartist,
};