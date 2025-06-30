import React, { useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Components/Context/useAppContext";
import axios from "axios";
import { toast } from "react-toastify";
export const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { backendUrl, setIsLoggedIn, getUserData } = useAppContext();

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/signup", {
          email,
          username,
          fullname,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          toast.success(data.msg || "Account Created Successfully");
          navigate("/login");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
          toast.success(data.message || "LogIn Successfully");
        } else {
          toast.error(data.message);
        }
      }

      // eslint-disable-next-line no-unused-vars, no-empty
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-white to-blue-400 ">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:32"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-2xl w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl text-center font-semibold text-white mb-3">
          {state === "Sign Up" ? "Create Account " : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up "
            ? "Login to your Account! "
            : "Create your Account "}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.person_icon} alt="" />
                <input
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent outline-none "
                  type="text"
                  placeholder="fullname"
                  required
                />
              </div>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.person_icon} alt="" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent outline-none "
                  type="text"
                  placeholder="username"
                  required
                />
              </div>
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none "
              type="text"
              placeholder="email"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none "
              type="text"
              placeholder="password"
              required
            />
          </div>
          <p
            className="mb-4 text-indigo-500 cursor-pointer"
            onClick={() => navigate("/reset-pass")}
          >
            Forgot Password
          </p>
          <button className="w-full  py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4 ">
            Already have account?{" "}
            <span
              className="text-blue-400 underline  cursor-pointer "
              onClick={() => setState("Login")}
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4 ">
            Don't have account ?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 underline  cursor-pointer "
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
