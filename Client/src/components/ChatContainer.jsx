import React, { useContext, useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../libs/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = () => {
  const { messages, selectedUser, setselectedUser, sendMessage, getMessage } =
    useContext(ChatContext);
  const { authUser, onlineUser } = useContext(AuthContext);
  const scrollEnd = useRef();
  const [Input, setInput] = useState("");
  const handlesendmessage = async (e) => {
    e.preventDefault();
    if (Input.trim() === "") return null;
    await sendMessage({ text: Input.trim() });
    setInput("");
  };
  const handlesendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a image please!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({
        image: reader.result,
      });
      e.target.value = "";
    };
  };
  useEffect(() => {
    if (selectedUser) {
      getMessage(selectedUser._id);
    }
  }, [selectedUser]);
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="User"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullname}
          {onlineUser.includes(selectedUser._id)}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img
          onClick={() => setselectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img
          src={assets.help_icon}
          alt="Help"
          className="max-md:hidden max-w-5"
        />
      </div>

      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages
          ?.filter((msg) => msg && msg.senderId)
          .map((msg, id) => (
            <div
              key={id}
              className={`flex items-end gap-2 justify-end ${
                msg.senderId !== authUser._id && "flex-row-reverse"
              }`}
            >
              {msg.image ? (
                <img
                  src={assets.image}
                  alt="Sent Image"
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                    msg.senderId !== authUser._id
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="text-center text-xs">
                <img
                  src={
                    msg.senderId !== authUser._id
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  alt="Avatar"
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}
        <div ref={scrollEnd}></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={Input}
            onKeyDown={(e) => (e.key === "Enter" ? handlesendmessage(e) : null)}
            type="text"
            placeholder="Send Your Message"
            className="flex-1 text-sm p-3 bg-transparent border-none outline-none text-white placeholder-gray-400"
          />

          <input
            onChange={handlesendImage}
            type="file"
            id="image"
            accept="image/png,image/jpeg"
            hidden
          />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Upload"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img
          onClick={handlesendmessage}
          src={assets.send_button}
          alt="Send"
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_big} alt="Logo" className="max-w-60" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
