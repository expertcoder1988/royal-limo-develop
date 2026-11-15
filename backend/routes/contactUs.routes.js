import express from "express";
import { body } from "express-validator";
import {
  deleteForm,
  getForm,
  getForms,
  submitForm,
} from "../controllers/contactUsController.js";

const router = express.Router();

router.route("/").post(
  [
    body("firstname", "Name length should be minimum 3").isLength({ min: 3 }),
    body("lastname", "Name length should be minimum 3").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("phoneNo", "Phone number should not be empty").isLength({
      min: 1,
    }),
    body("message", "Message should not be empty").isLength({
      min: 1,
    }),
  ],
  submitForm
);

router.route("/").get(getForms);

router.route("/:formId").get(getForm);

router.route("/:formId").delete(deleteForm);

export { router as contactUsRouter };
