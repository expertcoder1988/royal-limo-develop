import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants.js";
import admin from "../models/admin.js";

export const checkAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please Authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    let user = await admin.findById(data.user.id);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Please Authenticate using a valid admin token" });
    }
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please Authenticate using a valid token" });
  }
};
