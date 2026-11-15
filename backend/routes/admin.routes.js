import express from "express";
import {
  login,
  getUser,
  completeBooking,
} from "../controllers/adminController.js";
import { body } from "express-validator";
import { fetchUser } from "../middlewares/fetchUser.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";

const router = express.Router();
router
  .route("/login")
  .post(
    [
      body("email", "Enter a valid Email").isEmail(),
      body("password", "Passsword Cannot be Blank").exists(),
    ],
    login
  );

router.route("/get-user").get(fetchUser, getUser);

router.route("/booking/complete/:bookingId").put(checkAdmin, completeBooking);

router.get("/is-logged-in", checkAdmin, (req, res) => {
  res.send({ loggedIn: true });
});

export { router as adminRouter };
