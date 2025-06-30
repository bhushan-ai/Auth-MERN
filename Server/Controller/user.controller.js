import User from "../Model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodeMailer.js";

export const register = async (req, res) => {
  const { email, username, password, fullname } = req.body;
  //[email, username, password, name].some((field) => field.trim() === "")

  if ([email, username, password, fullname].some((field) => !field?.trim?.())) {
    return res
      .status(400)
      .json({ success: false, msg: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, msg: "user already exist " });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullname,
      username,
      password: hashedPassword,
      email,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? none : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //sending email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `welcome to auth site`,
      text: `Welcome my auth site. Your account has been created with email id: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: "SignUp successfully" });
  } catch (error) {
    return res.status(404).json({ success: false, msg: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field.trim() === "")) {
    return res
      .status(400)
      .json({ success: false, msg: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "invalid email" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ success: false, msg: "invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? none : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, msg: "Login successfully" });
  } catch (error) {
    return res.status(404).json({ success: false, msg: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? none : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ success: true, msg: "Logged Out" });
  } catch (error) {
    return res.status(404).json({ success: false, msg: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ success: false, msg: "userId required" });
  }

  try {
    const user = await User.findById(userId);

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account is already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Account verification otp`,
      text: `Your otp is ${otp}, Verify your otp using this OTP`,
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, msg: "Verification OTP sent on email" });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user?.id;

  if (!userId || !otp) {
    return res
      .status(400)
      .json({ success: false, msg: "userId and otp required" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(404).json({ success: false, message: "Invalid otp" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiredAt = 0;
    await user.save();

    return res
      .status(200)
      .json({ success: true, msg: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export const isVerified = async (req, res) => {
  try {
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `PASSWORD RESET OTP`,
      text: `Your OTP for resetting your password is ${otp} use this password to reset your password  `,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      msg: "Email for reset password sent successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "otp new password and email is required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpiredAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);

    user.password = hashedPass;
    user.resetOtp = "";
    user.resetOtpExpiredAt = 0;
    await user.save();

    return res.status(200).json({
      success: true,
      msg: "New password has been saved successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};
