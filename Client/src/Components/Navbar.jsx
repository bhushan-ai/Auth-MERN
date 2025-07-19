import React from "react";
import assets from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "./Context/useAppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useAppContext();

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message, "Verification otp sent to email");
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        toast.success(data.message);
      }
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-between w-full items-center p-4 sm:p-6 sm:px-24 absolute top-0 ">
      <img src={assets.logo} className="w-28 sm:w-32" />
      {userData ? (
        <div className="text-white flex justify-center items-center bg-gray-400  px-1.5 py-1 shadow-sm  rounded relative  group ">
          {userData.username}
          <div className="absolute  hidden group-hover:block  top-0  right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2  hover:bg-gray-200 cursor-pointer"
                >
                  Verify Email
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-2  hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 cursor-pointer
 hover:bg-gray-100 transition-all"
          onClick={() => navigate(`/login`)}
        >
          Login <img src={assets.arrow_icon} />
        </button>
      )}
    </div>
  );
}

export default Navbar;
