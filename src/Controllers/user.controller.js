const userModel = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Registration Functionality
const userRegistration = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  // Finding if the User is already exist with the same email or not.
  const isUserAlreadyRegistered = await userModel.findOne({ email });

  if (isUserAlreadyRegistered) {
    return res
      .status(400)
      .json({ message: "User Already registered with this email" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({ name, email, password: hashPassword });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(201).json({
    message: "User Registered Successfully",
    user,
  });
};

// User Login Functionality
const userLogin = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  // Now find User with the requested email
  const user = await userModel.findOne({ email });

  // If not Found
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // if  Found then match the password with the DB password
  const isValidPassword = await bcrypt.compare(password, user.password);

  // If Password is not valid
  if (!isValidPassword) {
    return res.status(400).json({ message: "Password is not valid" });
  }

  // If valid then
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "User LoggedIn Successfully",
  });
};

// User Logout Functionality
const userLogout = async (req, res) => {
  // it will clear  the cookie from res.cookie
  res.clearCookie("token");
  res.status(200).json({ message: "User LoggedOut Successfully" });
};

module.exports = { userRegistration, userLogin, userLogout };
