import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import UserRouter from "./Routes/userRoutes.js";
import messageRouter from "./Routes/messageroutes.js";
import { initSocket } from "./Models/Socket.js";

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(cors());

initSocket(server);

app.use("/api/status", (req, res) => res.send("Server is running"));
app.use("/api/auth", UserRouter);
app.use("/api/message", messageRouter);

await connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
