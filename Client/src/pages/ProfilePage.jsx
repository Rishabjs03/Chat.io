import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const ProfilePage = () => {
  const [SelectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [Name, setName] = useState("Martin johnson");
  const [Bio, setBio] = useState("Hi everyone, Im using Chat.io");
  function handlesubmit(e) {
    e.preventDefault();
    navigate("/");
  }
  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 broder-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          onClick={handlesubmit}
          className="flex flex-col  gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onClick={(e) => setSelectedImg(e.target.files[0])}
              type="file "
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img
              src={
                SelectedImg
                  ? URL.createObjectURL(SelectedImg)
                  : assets.avatar_icon
              }
              className={`w-12 h-12 ${SelectedImg && "rounded-full"}`}
              alt=""
            />
            Upload Profile Image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={Name}
            type="text"
            required
            placeholder="Your Name "
            className="p-2 border border-gray-500 bg-gray-400/10 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={Bio}
            rows={4}
            required
            placeholder="Your Bio"
            className="p-2 border border-gray-500 rounded-md  bg-gray-400/10 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>
        <img
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
          src={assets.logo_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfilePage;
