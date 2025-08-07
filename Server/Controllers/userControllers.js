// this file specifies the user controller functions for handling user-related operations like registration, login, and fetching user data.

import { generateToken } from "../lib/utils.js";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
// signup function to register a new user
export const signup = async (req, res) => {
  const { Email, Fullname, Password, ProfilePic, Bio } = req.body;
  try {
    if (!Email || !Fullname || !Password || !Bio) {
      return res.json({ success: false, message: "Missing required fields" });
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    // password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const newUser = new User.create({
      Fullname,
      Email,
      Password: hashedPassword,
      ProfilePic,
      Bio,
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
    const { Email, Password } = req.body;
    const userData = await User.findOne({ Email });
    const isPasswordValid = await bcrypt.compare(Password, userData.Password);

    if (!isPasswordValid) {
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
  res.jsom({
    success: true,
    user: req.User,
  });
};
// controller to update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { Fullname, Bio, ProfilePic } = req.body;
    let userId = req.User._id;
    let updatedUser;
    if (!ProfilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { Fullname, Bio },
        { new: true }
      );
    } else {
      const uploadedImage = await cloudinary.uploader.upload(ProfilePic, {
        folder: "chat-app",
      });
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { Fullname, Bio, ProfilePic: uploadedImage.secure_url },
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
