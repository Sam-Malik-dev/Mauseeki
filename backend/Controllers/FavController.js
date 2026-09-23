const FavModel = require("../Models/Fav");

const addToFav = async (req, res) => {
    try {
        const user = req.userId;
        const { albumId } = req.params;

        console.log("USER:", user);
        console.log("SONG:", albumId);

        if (!user) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        if (!albumId) {
            return res.status(400).json({
                message: "Album ID is required",
                success: false
            });
        }

        const existing = await FavModel.findOne({
            userId: user,
            albumId: albumId
        });

        if (existing) {
            await FavModel.findOneAndDelete({
                userId: user,
                albumId: albumId
            });

            return res.status(200).json({
                message: "Album removed from favourites",
                success: true
            });
        }

        const favalbum = new FavModel({
            userId: user,
            albumId: albumId
        });

        await favalbum.save();

        return res.status(201).json({
            message: "Album added to favourites",
            success: true,
            favourite: favalbum
        });

    } catch (error) {
        console.error("Like Error:", error);

        return res.status(500).json({
            message: "Internal server error...",
            success: false
        });
    }
};

const yourFav = async (req, res) => {
    try {
        const user = req.userId;
        console.log(user)
        const showfav = await FavModel.find({
            userId: user
        }).populate(
            "albumId",
            "albumtitle thumbnail description"
        );

        return res.status(200).json(showfav);

    } catch (error) {
        console.error("Your Fav Error:", error);

        return res.status(500).json({
            message: "Internal server error...",
            success: false
        });
    }
};
const deleteFav = async (req, res) => {
    try {
        const user = req.userId;
        const { album } = req.params;
        console.log(user, album);

        const Findfav = await FavModel.findOneAndDelete({
            userId: user,
            albumId: album
        });

        if (!Findfav) {
            return res.status(404).json({ message: "Album not found...", success: false });
        }

        res.status(200).json({ message: "Ablum removed from favs...", success: true });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error...",
            success: false
        });
    }
};

module.exports = {
    addToFav,
    yourFav,
    deleteFav
};