import express from "express";
import { body } from "express-validator";
import {
  createTransaction,
  disableCard,
  getCard,
  getCards,
  getUserCards,
  makePayment,
} from "../controllers/paymentController.js";
import { fetchUser } from "../middlewares/fetchUser.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";

const router = express.Router();

// router.route("/").post(makePayment);

router.route("/").get(fetchUser, getCards);

router.route("/user-cards/:id").get(checkAdmin, getUserCards);

router.route("/transaction").post(checkAdmin, createTransaction);

router.route("/card/:id").get(getCard);

router.route("/card/:id").delete(disableCard);

export { router as payRouter };
