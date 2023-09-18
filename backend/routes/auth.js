const express = require('express');
const router = express.Router();
const authController = require("../controller/auth/userController")
const refreshController = require("../controller/auth/refreshTokenController")

router.post("/register", authController.registerUser)
router.post("/login", authController.loginUser)
router.post("/logout", authController.logoutUser)
router.get("/refresh", refreshController)

module.exports = router