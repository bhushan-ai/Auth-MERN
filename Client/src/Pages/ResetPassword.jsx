import React, { useState } from "react";
import assets from "../assets/assets";
import { useAppContext } from "../Components/Context/useAppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const { backendUrl } = useAppContext();
  axios.defaults.withCredentials = true;
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      data.success
        ? toast.success(data.success || "Otp Sent to Email")
        : toast.error(data.message);

      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(backendUrl + "/api/auth/reset-pass", {
        email,
        otp,
        newPassword,
      });
      data.success
        ? toast.success(data.message || "Password Reset Successfully")
        : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-white to-blue-400 ">
      <img
        onClick={() => navigate("/login")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:32"
      />
      {/* //enter email field */}

      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8  rounded-lg shadow-lg  w-96  text-sm"
        >
          <h1 className="text-white text-2xl text-center font-semibold text-semibold mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email Address{" "}
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email id"
              type="email"
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-800 text-white rounded-full mt-5">
            Send OTP
          </button>
        </form>
      )}
      {/* //enter otp */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8  rounded-lg shadow-lg  w-96  text-sm"
        >
          <h1 className="text-white text-2xl text-center font-semibold text-semibold mb-4">
            Reset Password OTP
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
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-800 text-white rounded-full mt-5">
            Submit
          </button>
        </form>
      )}

      {/* //Enter new password */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8  rounded-lg shadow-lg  w-96  text-sm"
        >
          <h1 className="text-white text-2xl text-center font-semibold text-semibold mb-4">
            New Password{" "}
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your new Password{" "}
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="password"
              type="password"
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-800 text-white rounded-full mt-5">
            Reset Password{" "}
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
