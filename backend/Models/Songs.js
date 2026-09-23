const mongoose = require("mongoose");
const SongSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    artist: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "Artists",
    },

    album: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Album",
    },

    genre: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    audioUrl: {
      type: String,
      required: true,
    },

    lyrics: { type: String },
    addedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    releaseYear: { type: String },
    createdAt: { type: Date },
  },
  { timestamps: true },
);
const SongModel = mongoose.model("Songs", SongSchema);
module.exports = SongModel;
