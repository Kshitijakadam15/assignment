const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth.js");

const userController = require("../controllers/user.js");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/getProfile", auth, userController.getProfile);


module.exports = router;
