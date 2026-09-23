const FollowModel = require("../Models/Follow");

const follow = async (req, res) => {
    try {
        const user = req.userId;
        const { artist } = req.params;

        console.log(user, artist);

        const existFollower = await FollowModel.findOne({
            userId: user,
            artistId: artist
        });

        if (existFollower) {
            await FollowModel.findOneAndDelete({
                userId: user,
                artistId: artist
            });

            return res.status(200).json({
                message: "Unfollowed",
                success: true,
                followed: false
            });
        }

        const newFollow = new FollowModel({
            userId: user,
            artistId: artist
        });

        await newFollow.save();

        res.status(200).json({
            message: "Followed",
            success: true,
            followed: true
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error...",
            success: false
        });
    }
};

const Followed = async (req, res) => {
    try {
        const user = req.userId;

        console.log("FOLLOWED USER:", user);

        const followed = await FollowModel.find({
            userId: user
        }).populate("artistId", "artistname image genres language bio");

        console.log("FOLLOWED DATA:", followed);

        return res.status(200).json(followed);

    } catch (error) {
        console.log("FOLLOWED ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error..."
        });
    }
};

const followers = async (req, res) =>{
    try {
        const userId = req.userId;
        console.log(userId);

        const Followers = await FollowModel.find({
            artistId: userId
        });
        if(!Followers){
            return res.status(404).json({message: "Not found..."});
        };
        res.status(200).json(Followers);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error...", success:false});
    }
};

module.exports = {
    follow,
    Followed,
    followers
}