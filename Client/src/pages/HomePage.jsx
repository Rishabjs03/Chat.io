import React from "react";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSideBar";
import { useState } from "react";
const HomePage = () => {
  const [SelectedUser, setSelectedUser] = useState(false);
  return (
    <div className="border border-black w-full h-screen sm:px-[15%] sm:py-[5%]  ">
      <div
        className={`backdrop-blur-xl border-2  border-gray-600 rounded-2xl overflow-hidden h-[100%] grid  grid-cols-1 relative ${
          SelectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <SideBar
          SelectedUser={SelectedUser}
          setSelectedUser={setSelectedUser}
        />
        <ChatContainer
          SelectedUser={SelectedUser}
          setSelectedUser={setSelectedUser}
        />
        <RightSideBar SelectedUser={SelectedUser} />
      </div>
    </div>
  );
};

export default HomePage;
