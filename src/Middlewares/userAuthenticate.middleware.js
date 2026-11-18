const jwt = require("jsonwebtoken");
const userModel = require("../Models/user.model");

const userAuthMiddleware = async (req, res, next) => {
  // First retrieve the token
  const token = req.cookies.token;
  // if the token is not present
  if (!token) {
    return res.status(401).json({
      message: "Please login first",
    });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    // Now creating new property user in request
    req.user = user;
    next();
  } catch (error) {}
};

module.exports = { userAuthMiddleware };
