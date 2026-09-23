const AlbumModel = require("../Models/Album");
const ArtistModel = require("../Models/Artist");
const SongModel = require("../Models/Songs");

const search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || !query.trim()) {
            return res.status(400).json({
                message: "Search query is required",
                success: false
            });
        }

        const searchWord = query.trim();

        // Escape special regex characters
        const escapedWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const regex = new RegExp(escapedWord, "i");

        // Search Songs
        const songs = await SongModel.find({
            $or: [
                { title: regex },
                { genre: regex },
                { category: regex },
                { language: regex },
                { lyrics: regex }
            ]
        })
        .populate("artist", "artistname image")
        .populate("album", "albumtitle thumbnail");

        // Search Albums
        const albums = await AlbumModel.find({
            $or: [
                { albumtitle: regex },
                { description: regex }
            ]
        })
        .populate("artist", "artistname image");

        // Search Artists
        const artists = await ArtistModel.find({
            $or: [
                { artistname: regex },
                { bio: regex },
                { language: regex },
                { region: regex }
            ]
        });

        res.status(200).json({
            message: "Search results",
            success: true,
            songs,
            albums,
            artists
        });

    } catch (error) {
        console.log("SEARCH ERROR:", error);

        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {
    search
};