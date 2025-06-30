import { Router } from "express";
import {
  login,
  logout,
  register,
  sendVerifyOtp,
  verifyEmail,
  isVerified,
  sendResetOtp,
  resetPassword,
} from "../Controller/user.controller.js";
import userAuth from "../Middleware/userAuth.js";

const route = Router();

route.post("/signup", register);
route.post("/login", login);
route.post("/logout", logout);
route.post("/send-verify-otp", userAuth, sendVerifyOtp);
route.post("/verify-account", userAuth, verifyEmail);
route.post("/is-auth", userAuth, isVerified);
route.post("/send-reset-otp", sendResetOtp);
route.post("/reset-pass", resetPassword);

export default route;
