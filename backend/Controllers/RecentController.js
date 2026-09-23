const RecentModel = require("../Models/Recent");

const addtorecent = async (req, res) => {
  try {
    const user = req.userId;
    const { songId } = req.params;

    const alreadyadd = await RecentModel.findOne({
      userId: user,
      songId: songId,
    });

    if (alreadyadd) {
      alreadyadd.playedAt = new Date();
      await alreadyadd.save();

      return res.status(200).json({
        message: "Recent song updated",
        success: true,
      });
    }

    const addRecent = new RecentModel({
      userId: user,
      songId: songId,
      playedAt: new Date(),
    });

    await addRecent.save();

    res.status(200).json({
      message: "Song added to recent",
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

const recentlyPlayed = async (req, res) => {
    try {
        const user = req.userId;
        const recents = await RecentModel.find({
            userId: user
        }).populate("songId", "title audioUrl coverImage language").sort({ playedAt: -1 }).limit(5);
        res.status(200).json(recents);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error...", success: false });
    }
};

module.exports = {
    addtorecent,
    recentlyPlayed
}