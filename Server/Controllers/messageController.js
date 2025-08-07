import Message from "../Models/Message.js";
import { io, UserSocketMap } from "../Server.js";
export const getuserforsidebar = async (req, res) => {
  try {
    const userId = req.User._id;
    const fliteredusers = await User.find({ _id: { $ne: userId } }).select(
      "-Password"
    );

    // count number of unseen messages
    const unseenMessagesCount = {};
    const promises = fliteredusers.map(async (user) => {
      const messages = await Message.find({
        SenderId: userId,
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

// get all messages between two users
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
// api to make message seen
export const markMessageSeen = async (req, res) => {
  try {
    const { id } = id.params;
    await Message.findByIdAndIpdate(id, { seen: true });
    res.json({ success: true, message: "Message marked as seen" });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// send message to selected user
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

    // emit message to the receiver
    const receiverSocketId = UserSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", newMessage);
    }
    res.json({
      success: true,
      message: newMessage,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
