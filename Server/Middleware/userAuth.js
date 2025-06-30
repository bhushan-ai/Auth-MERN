import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, msg: "not authorized Login again" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (decodedToken.id) {
      req.user = { id: decodedToken.id };
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "not authorized Login again" });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: `error in authjs ${error.message} ` });
  }
};

export default userAuth;
