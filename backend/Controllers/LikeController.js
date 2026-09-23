const LikeModel = require('../Models/Like');

const LikeSong = async (req, res) => {
    try {
        const user = req.userId;
        const { songId } = req.params;

        console.log("USER:", user);
        console.log("SONG:", songId);

        if (!user) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        if (!songId) {
            return res.status(400).json({
                message: "Song ID is required",
                success: false
            });
        }

        const existing = await LikeModel.findOne({
            userId: user,
            songId: songId
        });

        if (existing) {
            await LikeModel.findOneAndDelete({
                userId: user,
                songId: songId
            });

            return res.status(200).json({
                message: "song removed from favourites",
                success: true
            });
        }

        const likesong = new LikeModel({
            userId: user,
            songId: songId
        });

        await likesong.save();

        return res.status(201).json({
            message: "song added to favourites",
            success: true,
            favourite: likesong
        });

    } catch (error) {
        console.error("Like Error:", error);

        return res.status(500).json({
            message: "Internal server error...",
            success: false
        });
    }
};


const yourLiked = async (req, res) => {
    try {
        const user = req.userId;

        console.log("USER ID:", user);

        const showSong = await LikeModel.find({
            userId: user
        })
        .populate(
            "songId",
            "title genre language coverImage audioUrl"
        );

        console.log("LIKED SONGS:", showSong);

        if (!showSong || showSong.length === 0) {
            return res.status(404).json({
                message: "No favourite songs yet...",
                success: false
            });
        }

        return res.status(200).json(showSong);

    } catch (error) {
        console.error("YOUR LIKES ERROR:", error);

        return res.status(500).json({
            message: "Internal server error...",
            success: false
        });
    }
};


const deleteLiked = async (req, res) => {
    try {
        const user = req.userId;
        const { song } = req.params;

        console.log(user, song);

        const findSong = await LikeModel.findOneAndDelete({
            userId: user,
            songId: song
        });

        if (!findSong) {
            return res.status(404).json({
                message: "song not found...",
                success: false
            });
        }

        return res.status(200).json({
            message: "song removed from favourites...",
            success: true
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error...",
            success: false
        });
    }
};


module.exports = {
    LikeSong,
    yourLiked,
    deleteLiked
};