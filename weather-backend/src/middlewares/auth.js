
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

module.exports.auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(403)
      .json({ error: "Please provide an Authorization header!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET);

    const user = await User.findOne({ email: decoded.email, isDeleted: false });

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token!" });
  }
};
