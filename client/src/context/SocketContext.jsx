import { createContext, useContext, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { useAppStore } from "../store";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const pusherRef = useRef();
  const { userInfo, selectedChatData, selectedChatType } = useAppStore();

  // 1. Initial Connection & Private DM Channel
  useEffect(() => {
    if (userInfo) {
      pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      });

      const userChannel = pusherRef.current.subscribe(`user-${userInfo.id}`);

      userChannel.bind("recieveMessage", (message) => {
        const { selectedChatData, selectedChatType, addMessage, addContactsInDMCOntacts } = useAppStore.getState();
        
        if (
          selectedChatType === "contact" &&
          (selectedChatData?._id === message.sender._id ||
            selectedChatData?._id === message.recipient._id)
        ) {
          addMessage(message);
        }
        addContactsInDMCOntacts(message);
      });

      return () => {
        pusherRef.current.unsubscribe(`user-${userInfo.id}`);
        pusherRef.current.disconnect();
      };
    }
  }, [userInfo]);

  // 2. Dynamic Channel Subscription (For Group Chats)
  useEffect(() => {
    if (pusherRef.current && selectedChatType === "channel" && selectedChatData?._id) {
      const channelId = selectedChatData._id;
      const channelName = `channel-${channelId}`;
      
      const channel = pusherRef.current.subscribe(channelName);

      channel.bind("recieve-channel-message", (message) => {
        const { selectedChatData, addMessage, addChannelInChannelList } = useAppStore.getState();
        
        // Agar wahi channel khula hai toh message add karo
        if (selectedChatData?._id === message.channelId) {
          addMessage(message);
        }
        // Sidebar update karne ke liye
        addChannelInChannelList(message);
      });

      console.log(`Subscribed to channel: ${channelName}`);

      return () => {
        pusherRef.current.unsubscribe(channelName);
      };
    }
  }, [selectedChatData, selectedChatType]);

  return (
    <SocketContext.Provider value={pusherRef.current}>
      {children}
    </SocketContext.Provider>
  );
};