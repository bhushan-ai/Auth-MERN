import User from "../Model/user.model.js";

const getAllUserData = async (req, res) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.fullname,
        username: user.username,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default getAllUserData;
