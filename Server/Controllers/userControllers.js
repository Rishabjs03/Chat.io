// this file specifies the user controller functions for handling user-related operations like registration, login, and fetching user data.

import { generateToken } from "../lib/utils.js";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
// signup function to register a new user
export const signup = async (req, res) => {
  const { email, fullname, password, profilepic, bio } = req.body;
  try {
    if (!email || !fullname || !password || !bio) {
      return res.json({ success: false, message: "Missing required fields" });
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    // password hash
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = new User.create({
      fullname,
      email,
      password: hashedpassword,
      profilepic,
      bio,
    });
    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// controller function for user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    const ispasswordValid = await bcrypt.compare(password, userData.password);

    if (!ispasswordValid) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }
    const token = generateToken(userData._id);
    res.json({
      success: true,
      userData,
      token,
      message: "Login successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// to check if the user is authenticated or not
export const isAuthenticated = async (req, res) => {
  res.json({
    success: true,
    user: req.User,
  });
};
// controller to update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { fullname, bio, profilepic } = req.body;
    let userId = req.User._id;
    let updatedUser;
    if (!profilepic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullname, bio },
        { new: true }
      );
    } else {
      const uploadedImage = await cloudinary.uploader.upload(profilepic, {
        folder: "chat-app",
      });
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullname, bio, profilepic: uploadedImage.secure_url },
        { new: true }
      );
    }
    res.json({
      success: true,
      userData: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
