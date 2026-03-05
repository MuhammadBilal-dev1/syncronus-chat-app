import mongoose from "mongoose";
import Message from "../models/MessagesModel.js";
import { unlinkSync } from "fs";
import cloudinary from '../lib/cloudinary.js'

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      res.status(400).send("Both user Id are required");
      return;
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }

    // Cloudinary par file upload (folder: chat-app-messages)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "syncronus-chat-app",
      resource_type: "auto", // Ye image, video, aur raw files (zip/pdf) sab handle kar lega
    });

    // Local temp file delete karein
    unlinkSync(req.file.path);

    // Secure URL return karein
    res.status(200).json({ filePath: result.secure_url });
  } catch (error) {
    console.error("Cloudinary Chat Upload Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
