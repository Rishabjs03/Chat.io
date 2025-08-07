import mongoose from "mongoose";
// function to connect to the database
const messageschema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    text: { type: String, required: true },
    image: { type: String, default: "" },
    seen: { type: Boolean, default: false },
  },
  { Timestamp: true }
);
const Message = mongoose.model("Message", messageschema);

export default Message;
