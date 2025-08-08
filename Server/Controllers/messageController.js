import Message from "../Models/Message.js";
import User from "../Models/User.js"; // Add this import if not already present
import { io, UserSocketMap } from "../Models/Socket.js";

export const getuserforsidebar = async (req, res) => {
  try {
    const userId = req.User._id;
    const fliteredusers = await User.find({ _id: { $ne: userId } }).select(
      "-Password"
    );

    const unseenMessagesCount = {};
    const promises = fliteredusers.map(async (user) => {
      const messages = await Message.find({
        SenderId: userId, // Note: You used SenderId, but later senderId. Standardize casing.
        ReceiverId: user._id,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessagesCount[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.json({
      success: true,
      users: fliteredusers,
      unseenMessagesCount,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const userId = req.User._id;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: userId },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: userId, seen: false },
      { $set: { seen: true } }
    );
    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const markMessageSeen = async (req, res) => {
  try {
    const { id } = req.params; // Fixed typo
    await Message.findByIdAndUpdate(id, { seen: true }); // Fixed typo
    res.json({ success: true, message: "Message marked as seen" });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.User._id;
    const receiverId = req.params.id;

    let ImageUrl;
    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image);
      ImageUrl = cloudinaryResponse.secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: ImageUrl,
    });

    const receiverSocketId = UserSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", newMessage);
    }
    res.json({
      success: true,
      message: newMessage,
      message: "Message sent successfully", // Note: Duplicate 'message' key. Consider fixing.
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
