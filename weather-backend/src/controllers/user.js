const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
module.exports.register = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a token
    const accessToken = jwt.sign(
      { userId: newUser._id.toString(), email: newUser.email },
      process.env.APP_SECRET,
      {
        expiresIn: "7h",
      }
    );

    return res.status(201).send({
      status: true,
      message: "User registered successfully",
      data: { accessToken, user: newUser },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

// Login function
module.exports.login = async (req, res) => {
  try {
    const { email, password, roleType } = req.body;
    const user = await User.findOne({ email, isDeleted: false, roleType });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Generate token
    const accessToken = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.APP_SECRET,
      {
        expiresIn: "7h",
      }
    );

    return res.status(200).send({
      status: true,
      message: "Logged in successfully!",
      data: { accessToken, user },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

// Get user profile function
module.exports.getProfile = async (req, res) => {
  try {
    return res.status(200).json({ status: true, user: req.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};
