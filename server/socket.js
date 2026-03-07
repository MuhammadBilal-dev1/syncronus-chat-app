import Pusher from "pusher";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const setupSocket = (app) => {
  // Direct API route for sending messages via Pusher
  app.post("/api/messages/send-message", async (req, res) => {
    try {
      const { message } = req.body;
      const createdMessage = await Message.create(message);
      
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

      // Triggering Pusher event to both sender and recipient
      await pusher.trigger(`user-${message.recipient}`, "recieveMessage", messageData);
      await pusher.trigger(`user-${message.sender}`, "recieveMessage", messageData);
      
      return res.status(200).json(messageData);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post("/api/messages/send-channel-message", async (req, res) => {
    try {
      const { message } = req.body;
      const { sender, content, messagesTypes, fileUrl, channelId } = message;

      const createMessage = await Message.create({
        sender, recipient: null, content, messagesTypes,
        timeStamp: new Date(), fileUrl,
      });

      const messageData = await Message.findById(createMessage._id)
        .populate("sender", "id email firstName lastName image color").exec();

      await Channel.findByIdAndUpdate(channelId, { $push: { messages: createMessage._id } });

      const finalData = { ...messageData._doc, channelId };

      // Triggering to all channel members
      await pusher.trigger(`channel-${channelId}`, "recieve-channel-message", finalData);
      
      return res.status(200).json(finalData);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

export default setupSocket;