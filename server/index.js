import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
import messageRoutes from "./routes/MessageRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";
// ... baqi imports wahi rahengi
dotenv.config();

const app = express();
// DATABASE_URL check karein
const databaseURL = process.env.DATABASE_URL;

// DB Connection ko app.use se pehle le aayein taake request handle hone se pehle connect ho jaye
mongoose
  .connect(databaseURL)
  .then(() => console.log(`✅ DB connection Successfull`))
  .catch((error) => console.log(`❌ Connection Failed `, error));

app.use(
  cors({
    origin: [process.env.ORIGIN],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);

// Socket setup (Is mein humne Pusher integrate kiya hua hai local test ke baad)
setupSocket(app);

// IMPORTANT: Vercel par iski zaroorat nahi hoti, niche wala condition add karein
if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT || 3001}`);
  });
}

export default app;