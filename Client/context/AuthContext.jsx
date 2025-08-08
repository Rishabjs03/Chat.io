import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // ✅ Connect to socket
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    // Disconnect existing socket if any
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 20000,
      forceNew: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    newSocket.on("onlineUsers", (userIds) => {
      setOnlineUser(userIds);
    });

    setSocket(newSocket);
  };

  // ✅ Check if already logged in
  const checkAuth = async () => {
    if (!token) return;
    try {
      axios.defaults.headers.common["token"] = token;

      const { data } = await axios.get(`/api/auth/check`);

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      setToken(null);
      localStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
    }
  };

  // ✅ Signup or Login
  const authHandler = async (state, credentials) => {
    try {
      const endpoint =
        state === "Sign Up" ? "/api/auth/signup" : "/api/auth/login";
      const { data } = await axios.post(endpoint, credentials);

      console.log("API Response:", data); // Debug the response

      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);

        axios.defaults.headers.common["token"] = data.token;
        localStorage.setItem("token", data.token);
        setToken(data.token);

        toast.success(`${state} successful`);
        console.log("Navigating to homepage"); // Debug navigation
        navigate("/"); // redirect to homepage
      } else {
        toast.error(data.message || `${state} failed`);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || `An error occurred during ${state}`;
      toast.error(msg);
      console.error("Auth Error:", error);
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    navigate("/login");
  };

  // ✅ Update Profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.userData);
        toast.success("Profile updated");
      }
    } catch (error) {
      toast.error(error.message || "Profile update failed");
    }
  };

  // ✅ Check auth on initial load
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    onlineUser,
    socket,
    authHandler,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
