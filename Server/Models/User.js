import mongoose from "mongoose";
// function to connect to the database
const userschema = new mongoose.Schema(
  {
    Email: { type: String, required: true, unique: true },
    Fullname: { type: String, required: true },
    Password: { type: String, required: true, minlength: 6 },
    ProfilePic: { type: String, default: "" },
    Bio: { type: String },
  },
  { Timestamp: true }
);
const User = mongoose.model("User", userschema);

export default User;
