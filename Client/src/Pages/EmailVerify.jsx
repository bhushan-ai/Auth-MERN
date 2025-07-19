import React, { useEffect } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Components/Context/useAppContext";
import { toast } from "react-toastify";
import axios from "axios";
function EmailVerify() {
  axios.defaults.withCredentials = true;
  const { userData, backendUrl, getUserData, isLoggedIn } = useAppContext();

  const navigate = useNavigate();

  const inputRef = React.useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === `` && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pastArray = paste.split("");
    pastArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        {
          otp,
        }
      ); //
      if (data.success) {
        toast.success(data.message || "Email Verified Successfully");
        getUserData();
        navigate("/");
      } else {
        toast.error(error.message || "Something went wrong");
      } //
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-white to-blue-400 ">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:32 cursor-pointer"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8  rounded-lg shadow-lg  w-96  text-sm"
      >
        <h1 className="text-white text-2xl text-center font-semibold text-semibold mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your email id{" "}
        </p>
        <div className="flex justify-between mb-0" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                type="text"
                maxLength="1"
                key={index}
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                required
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-800 text-white rounded-full mt-5">
          Verify Email
        </button>
      </form>
    </div>
  );
}

export default EmailVerify;
