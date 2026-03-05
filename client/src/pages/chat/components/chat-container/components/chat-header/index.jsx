import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "../../../../../../store";
import { HOST } from "../../../../../../utils/constant";
import { getColor } from "../../../../../../lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import group_symbol from '/group_symbol.jpg'

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } =
    useAppStore.getState();


  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            {selectedChatType === "contact" ? (
                <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                  {selectedChatData?.image ? (
                    <AvatarImage
                      src={`${HOST}${selectedChatData?.image}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                        selectedChatData.color
                      )}`}
                    >
                      {selectedChatData.firstName
                        ? selectedChatData.firstName.split("").shift()
                        : selectedChatData.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
            ) : (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                <AvatarImage
                  src={group_symbol}
                  alt="group-icon"
                  className="object-cover w-full h-full bg-black"
                />
              </Avatar>
            )}
          </div>
          <div>
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer hover:bg-[#2f303b] "
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
