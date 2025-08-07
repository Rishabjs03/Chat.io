import express from "express";
import {
  isAuthenticated,
  login,
  signup,
  updateProfile,
} from "../Controllers/userControllers.js";
import { protectroute } from "../middleware/auth.js";

const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/login", login);
UserRouter.put("/update-profile", protectroute, updateProfile);
UserRouter.get("/check", protectroute, isAuthenticated);

export default UserRouter;
