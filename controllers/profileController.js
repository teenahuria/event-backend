const { User } = require('../models/users');
const path = require('path');
const fs = require('fs');

// -------------------- GET Profile --------------------
const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { user_id: req.user.user_id },
      attributes: ['name', 'email', 'profile_pic']
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        email: user.email
      },
      profile_pic: user.profile_pic || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- POST Update Profile Picture --------------------

const updateProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const profilePicPath = `/public/uploads/${req.file.filename}`;

    const user = await User.findByPk(parseInt(req.user.user_id));
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.profile_pic = profilePicPath;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profile_pic: profilePicPath,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
