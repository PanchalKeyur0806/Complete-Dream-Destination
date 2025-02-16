const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

const routes = express.Router();

// forget password and reset password
// for anyone
routes.route("/forgotpassword").post(authController.forgetPassword);
routes.route("/resetpassword/:token").post(authController.resetPassword);

// for authenticating user
routes.route("/signup").post(authController.signUp);
routes.route("/login").post(authController.login);

// for signup tour-guide
// only admin can create tour guide
routes.route("/tour-guide").post(authController.tourGuide);

// get all user
// only admin can access this route
// routes.use(authController.protect, authController.restrictTo("admin"));
routes.route("/").get(userController.getAllUser);

module.exports = routes;
