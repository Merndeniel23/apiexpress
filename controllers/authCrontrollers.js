const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "All fields required" });

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ msg: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString("hex");

  await User.create({
    email,
    password: hashed,
    verificationToken: token
  });

  const link = `http://localhost:5000/api/auth/verify/${token}`;
  
  await sendEmail(email, "Verify Email", link);

  res.json({ msg: "Signup successful, check email" });
};

exports.verifyEmail = async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token });

  if (!user) return res.status(400).json({ msg: "Invalid token" });

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  res.json({ msg: "Email verified" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  if (!user.isVerified)
    return res.status(400).json({ msg: "Verify email first" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: "Wrong password" });

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

  res.json({ accessToken, refreshToken });
};