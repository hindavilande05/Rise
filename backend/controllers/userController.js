const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ✅ Get User Profile by ID
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password"); 
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error });
    }
};


// update user password
exports.updatePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { password } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});
