const UserModel = require("../Models/User");
const cloudinary = require("cloudinary");
const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SendEmail = require("../Middelwares/Email");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// signup
const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res
        .status(401)
        .json({ message: "Please fill in all fields...", success: false });
    }
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res
        .status(409)
        .json({ message: "User already exists...", success: false });
    }
    const hashed = await bcrypt.hash(password, 10);
    const veriCode = Math.floor(100000 + Math.random() * 900000).toString();
    let image = "";
    if (req.files && req.files.profilepic) {
      const pic = req.files.profilepic[0];

      const uploaded = await cloudinary.uploader.upload(pic.path, {
        resource_type: "auto",
      });
      image = uploaded.secure_url;
      try {
        fs.unlink(pic.path);
      } catch (error) {
        console.log("pic not deleted", error);
      }
    }
    const user = new UserModel({
      firstname: firstname.toLowerCase(),
      lastname: lastname.toLowerCase(),
      email,
      password: hashed,
      profilepic: image,
      VerifyCode: veriCode,
    });
    await user.save();
    SendEmail(email, veriCode);

    res.status(200).json({ message: "Signed up...", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error...", success: false });
  }
};
// login
const login = async (req, res) => {
  try {
    const { email, password, VerifyCode } = req.body;

    const IsUser = await UserModel.findOne({ email, VerifyCode });

    if (!IsUser) {
      return res.status(404).json({
        message: "User not found...",
        success: false,
      });
    }

    const IsPassword = await bcrypt.compare(password, IsUser.password);

    if (!IsPassword) {
      return res.status(401).json({
        message: "Wrong password...",
        success: false,
      });
    }

    const token = jwt.sign(
      { _id: IsUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      message: "Logged in...",
      success: true,
      token,
      firstname: IsUser.firstname,
      lastname: IsUser.lastname,
      email: IsUser.email,
      profilepic: IsUser.profilepic,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error...",
      success: false,
    });
  }
};
// userinfo
const currentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const thisUser = await UserModel.findById(userId)
      .select("firstname lastname profilepic email");

    if (!thisUser) {
      return res.status(404).json({
        message: "User not found...",
        success: false,
      });
    }

    return res.status(200).json(thisUser);

  } catch (error) {
    console.log("CURRENT USER ERROR:", error);

    return res.status(500).json({
      message: "Internal server error...",
      success: false,
    });
  }
};
// signout
const signout = async (req, res) => {
  try {
    const { _id } = req.userId;
    const deluser = await UserModel.findOneAndDelete(_id);
    res.status(200).json({ message: "Deleted...", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error...", success: false });
  }
};
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    console.log("=================================");
    console.log("USER ID:", userId, typeof userId);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("=================================");

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user ID missing from token",
      });
    }

    const {
      firstname,
      lastname,
      email,
      password,
    } = req.body || {};

    const updateData = {};

    if (firstname) {
      updateData.firstname = firstname.trim().toLowerCase();
    }

    if (lastname) {
      updateData.lastname = lastname.trim().toLowerCase();
    }

    if (email) {
      updateData.email = email.trim().toLowerCase();
    }

    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(
        password.trim(),
        10
      );
    }

    if (
      req.files &&
      req.files.profilepic &&
      req.files.profilepic.length > 0
    ) {
      const pic = req.files.profilepic[0];

      const uploaded = await cloudinary.uploader.upload(
        pic.path,
        {
          resource_type: "auto",
        }
      );

      updateData.profilepic = uploaded.secure_url;

      try {
        fs.unlinkSync(pic.path);
      } catch (error) {
        console.log("FILE DELETE ERROR:", error);
      }
    }

    console.log("UPDATE DATA:", updateData);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data received to update",
      });
    }

    // Check for email collision with another user before updating
    if (updateData.email) {
      const existingUser = await UserModel.findOne({
        email: updateData.email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another account",
        });
      }
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select(
      "_id firstname lastname email profilepic"
    );

    console.log("UPDATED USER FROM DATABASE:", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found...",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully...",
      user: updatedUser,
    });

  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already in use by another account",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error...",
      error: error.message,
    });
  }
};
module.exports = {
  signup,
  login,
  currentUser,
  signout,
  updateProfile
};
