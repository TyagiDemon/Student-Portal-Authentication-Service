const express = require("express");
const userSignup = require("../controllers/signup.js");
const userLogin = require("../controllers/login.js");
const emailVerify = require("../controllers/emailVerify.js");
const passwordReset = require("../controllers/passwordReset.js");
const setNewPassword = require("../controllers/setNewPassword.js");
const verifyLogin = require("../controllers/verifyLogin.js");

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/emailVerify/:token", emailVerify);
router.post("/passwordReset", passwordReset);
router.post("/setNewPassword/:passwordResetToken", setNewPassword);
router.get("/verifyLogin/:token", verifyLogin);

module.exports = router;
