import express from "express";

import {
  getMessages,
  getuserforsidebar,
  markMessageSeen,
  sendMessage,
} from "../Controllers/messageController.js";
import { protectroute } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.get("/user", protectroute, getuserforsidebar);
messageRouter.get("/:id", protectroute, getMessages);
messageRouter.put("mark/:id", protectroute, markMessageSeen);
messageRouter.post("/send/:id", protectroute, sendMessage);

export default messageRouter;
