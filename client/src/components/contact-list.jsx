import React from "react";
import { useAppStore } from "../store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "../utils/constant";
import { getColor } from "../lib/utils";
import group_symbol from "/group_symbol.jpg";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    // Agar wahi chat dobara click ki hai jo pehle se open hai, to kuch na karo
    if (selectedChatData && selectedChatData._id === contact._id) return;

    // Type set karein
    setSelectedChatType(isChannel ? "channel" : "contact");

    // Naya data set karein
    setSelectedChatData(contact);

    // Messages ko foran khali karein taake naye chat ki loading clean ho
    setSelectedChatMessages([]);
  };

  console.log("contacts ", contacts);
  

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#7e0dff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10  rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={
                      contact.image && contact.image.startsWith("http")
                        ? contact.image
                        : `${HOST}/${contact.image}`
                    }
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`${
                      selectedChatData && selectedChatData._id === contact._id
                        ? "bg-[#ffffff22] border border-white/70"
                        : `${getColor(contact.color)}`
                    } uppercase h-10 w-10  text-lg border-[1px] flex items-center justify-center rounded-full `}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                <AvatarImage
                  src={group_symbol}
                  alt="group-icon"
                  className="object-cover w-full h-full bg-black"
                />
              </Avatar>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>
                {contact.firstName
                  ? `${contact.firstName} ${contact.lastName}`
                  : contact.email}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
