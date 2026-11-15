import { validationResult } from "express-validator";
import User from "../models/users.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants.js";
import bcrypt from "bcryptjs";
import { sendMail } from "../utils/sendMail.js";

const generateSecurityCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
};

export const signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    if (await User.findOne({ email: req.body.email })) {
      return res
        .status(400)
        .json({ errors: "An account is already created with this email" });
    }

    if (await User.findOne({ phoneNo: req.body.phoneNo })) {
      return res.status(400).json({
        errors: "An account is already created with this Phone Number",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const SecPassword = await bcrypt.hash(req.body.password, salt);
    const securityCode = generateSecurityCode();
    const SecSecurityCode = await bcrypt.hash(securityCode, salt);

    let user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phoneNo: req.body.phoneNo,
      password: SecPassword,
      securityCode: SecSecurityCode,
    };
    sendMail(
      req.body.email,
      "Royal Limo | Verify Sign Up Security Code",
      `Your sign up verification code is ${securityCode}`
    );
    const AuthToken = jwt.sign(user, JWT_SECRET, {
      expiresIn: "5m",
    });
    res.json({ AuthToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error occured");
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: "Sorry the user does not exist" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ errors: "Incorrect Password" });
    }

    const Data = {
      user: {
        id: user.id,
      },
    };
    const AuthToken = jwt.sign(Data, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ AuthToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error occured");
  }
};

export const verifyUser = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(400).json({
      errors: "Please Provide a token",
    });
  }

  if (!req.body.code) {
    return res.status(400).json({
      errors: "Please Provide a Verification Code",
    });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);

    if (
      !data.firstname &&
      !data.lastname &&
      !data.email &&
      !data.phoneNo &&
      !data.password
    ) {
      return res.status(400).json({ errors: "Please fill required fields" });
    }

    const securityCodeCompare = await bcrypt.compare(
      req.body.code,
      data.securityCode
    );

    if (securityCodeCompare) {
      delete data.securityCode;
      delete data.iat;
      delete data.exp;

      if (await User.findOne({ email: data.email })) {
        return res
          .status(400)
          .json({ errors: "An account is already created with this email" });
      }

      if (await User.findOne({ phoneNo: data.phoneNo })) {
        return res.status(400).json({
          errors: "An account is already created with this Phone Number",
        });
      }

      let user = await User(data);
      user
        .save()
        .then((data) => {
          const Data = {
            user: {
              id: data._id,
            },
          };
          console.log(data._id);
          const AuthToken = jwt.sign(Data, JWT_SECRET, {
            expiresIn: "24h",
          });
          res.json({ AuthToken });
        })
        .catch((error) => {
          res.json(error);
        });
    } else {
      return res.status(401).json({
        errors: "Invalid Verification Code",
      });
    }
  } catch (error) {
    return res.status(401).json({
      errors: "Verification Code Expired",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error occured");
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const securityCode = generateSecurityCode();
    const salt = await bcrypt.genSalt(10);
    const SecSecurityCode = await bcrypt.hash(securityCode, salt);

    const AuthToken = jwt.sign({ email, code: SecSecurityCode }, JWT_SECRET, {
      expiresIn: "5m",
    });

    sendMail(
      email,
      "Royal Limo | Reset Password Security Code",
      `Your sign up verification code is ${securityCode}`
    );
    res.status(200).json({
      AuthToken,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

export const verifyForgotPassword = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(400).json({
      errors: "Please Provide a token",
    });
  }

  if (!req.body.code) {
    return res.status(400).json({
      errors: "Please Provide a Verification Code",
    });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    const securityCodeCompare = await bcrypt.compare(req.body.code, data.code);

    if (securityCodeCompare) {
      const user = await User.findOne({ email: data.email });
      const AuthToken = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "5m",
      });
      return res.status(200).json({ AuthToken });
    } else {
      return res.status(401).json({
        errors: "Inavlid Verification Code",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { newPassword } = req.body;

  if (!token) {
    return res.status(400).json({
      errors: "Please Provide a token",
    });
  }

  if (!newPassword) {
    return res.status(400).json({ errors: "Missing new password" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(data.id);

    if (!user) {
      return res.status(404).json({ errors: "User not found" });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    user.password = encryptedPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res
      .status(401)
      .json({ errors: "Invalid or expired authentication token" });
  }
};
