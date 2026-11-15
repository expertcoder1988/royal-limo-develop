import express from "express";
import {
  signUp,
  login,
  verifyUser,
  getUser,
  forgotPassword,
  verifyForgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { body } from "express-validator";
import { fetchUser } from "../middlewares/fetchUser.js";

const router = express.Router();

router.route("/sign-up").post(
  [
    body("firstname", "Name length should be minimum 3").isLength({ min: 3 }),
    body("lastname", "Name length should be minimum 3").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password length should be minimum 5").isLength({
      min: 5,
    }),
  ],
  signUp
);

router
  .route("/login")
  .post(
    [
      body("email", "Enter a valid Email").isEmail(),
      body("password", "Passsword Cannot be Blank").exists(),
    ],
    login
  );

router.route("/verify-signup").post(verifyUser);

router.route("/get-user").get(fetchUser, getUser);

router.route("/forgot-password").post(forgotPassword);

router.route("/verify-forgot-password").post(verifyForgotPassword);

router.route("/reset-password").post(resetPassword);

export { router as authRouter };
