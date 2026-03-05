import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    const admin = await User.findById(userId);

    if (!admin) {
      res.status(400).send("Admin user not found");
      return;
    }

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      res.status(400).send("Some members are not valid users.");
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();

    res.status(201).json({ channel: newChannel });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};

export const getUserChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    res.status(201).json({ channels });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};

export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });

    if (!channel) {
      res.status(404).send("Channel not found.");
      return;
    }

    const messages = channel.messages;

    res.status(201).json({ messages });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};
