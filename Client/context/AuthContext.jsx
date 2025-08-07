import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;
export const AuthCOntext = createContext();

export const AuthProvider = ({ children }) => {
  const [Token, setToken] = useState(localStorage.getItem("token") || null);
  const [AuthUser, setAuthUser] = useState(null);
  const [OnlineUser, setOnlineUser] = useState([]);
  const [Socket, setSocket] = useState(null);
  //   check if user is authenticated and if so set the user data and connect to socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`/api/auth/check`);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error("Failed to authenticate user");
    }
  };
  //   login function to handle user login and socket connection
  const Signup = async (state, crendentials) => {
    try {
      const { data } = await axios.post(`/api/auth/signup`, crendentials);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success("Login successful");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {}
  };
  //   login function to handle logout and socket disconnection
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged Out Successfully");
    Socket.disconnect();
  };
  //   update profile function to handle  user profile updates
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successful");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //   connect socket function to  handle socket connection and online users updates
  const connectSocket = (userData) => {
    if (!userData || Socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("onlineUsers", (userIds) => {
      setOnlineUser(userIds);
    });
  };
  useEffect(() => {
    if (Token) {
      axios.defaults.headers.common["token"] = Token;
    }
    checkAuth();
  }, []);
  const value = {
    axios,
    AuthUser,
    OnlineUser,
    Socket,
    Signup,
    logout,
    updateProfile,
  };
  return <AuthCOntext.Provider value={value}>{children}</AuthCOntext.Provider>;
};
