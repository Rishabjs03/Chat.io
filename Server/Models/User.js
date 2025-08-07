import mongoose from "mongoose";
// function to connect to the database
const userschema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    bio: { type: String },
  },
  { Timestamps: true }
);
const User = mongoose.model("User", userschema);

export default User;
