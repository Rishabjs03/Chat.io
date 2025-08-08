import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setusers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [UnSeenMessage, setUnSeenMessage] = useState({});

  const { socket, axios } = useContext(AuthContext);

  //   function to get all user for sidebar
  const getUser = async () => {
    try {
      const { data } = await axios.get("/api/message/user");
      if (data.success) {
        setusers(data.users);
        setUnSeenMessage(data.UnSeenMessage);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //   function to get message for selected user
  const getMessage = async () => {
    try {
      const { data } = await axios.get(`/api/message/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //   function to send message to selected user
  const sendMessage = async () => {
    try {
      const { data } = await axios.post(
        `/api/message/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //   function to subscribe to messages for selected user
  const subscribeToMessages = async () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/message/mark/${newMessage._id}`);
      } else {
        setUnSeenMessage((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };
  //   function to unsubcribe from messages
  const unsubcribeMessages = async () => {
    if (socket) socket.off("newMessage");
  };
  useEffect(() => {
    subscribeToMessages();
    return () => unsubcribeMessages();
  }, [socket, selectedUser]);
  const value = {
    messages,
    users,
    selectedUser,
    getUser,
    setMessages,
    getMessage,
    sendMessage,
    setSelectedUser,
    UnSeenMessage,
    setUnSeenMessage,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
