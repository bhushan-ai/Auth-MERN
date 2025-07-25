import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: " " },
  verifyOtpExpiredAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: " " },
  resetOtpExpiredAt: { type: Number, default: 0 },
});

const User = mongoose.model.user || mongoose.model("user", userSchema);

export default User;
