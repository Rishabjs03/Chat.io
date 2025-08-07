import React, { useState } from "react";
import assets from "../assets/assets";
import { useContext } from "react";
import { AuthCOntext } from "../../context/AuthContext";

const LoginPage = () => {
  const [Currstate, setCurrstate] = useState("Sign Up");
  const [Fullname, setFullname] = useState("");
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Bio, setBio] = useState("");
  const [IsDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthCOntext);
  function Handlesubmit(e) {
    e.preventDefault();
    if (Currstate === "Sign Up") {
      setIsDataSubmitted(true);
    } else {
      // Handle login logic here
      console.log("Logging in with", { Email, Password });
    }
    login(Currstate === "Sign Up" ? "signup" : "login", {
      fullname: Fullname,
      email: Email,
      password,
      bio: Bio,
    });
  }
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

      <form
        onSubmit={Handlesubmit}
        className="border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {Currstate}
          {IsDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {Currstate === "Sign Up" && !IsDataSubmitted && (
          <input
            type="text"
            className="p-2 border bg-gray-500/10 text-white border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 "
            placeholder="Name"
            required
            value={Fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        )}

        {!IsDataSubmitted && (
          <>
            <input
              type="email"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-500/10 text-white"
              placeholder="Email"
              required
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-500/10 text-white"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        {Currstate === "Sign Up" && IsDataSubmitted && (
          <textarea
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-500/10 text-white"
            placeholder="Provide a short bio"
            required
            value={Bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        )}

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          {Currstate === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          <p>Agree to Terms and Conditions</p>
        </div>
        <div className="flex flex-col gap-2">
          {Currstate === "Sign Up" ? (
            <p className="text-sm text-gray-600">
              Already have a Account?{" "}
              <span
                onClick={() => {
                  setCurrstate("Login");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className="text-sm  text-gray-600">
              Create a Account{" "}
              <span
                onClick={() => {
                  setCurrstate("Sign Up");
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click Here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
