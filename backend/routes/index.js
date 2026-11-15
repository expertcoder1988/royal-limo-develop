import express from "express";
import { authRouter } from "./auth.routes.js";
import { bookingRouter } from "./booking.routes.js";
import { contactUsRouter } from "./contactUs.routes.js";
import { payRouter } from "./pay.routes.js";
import { adminRouter } from "./admin.routes.js";
import { blogRouter } from "./blog.routes.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/admin", adminRouter);

router.use("/booking", bookingRouter);

router.use("/blog",blogRouter)

router.use("/contact-us", contactUsRouter);

router.use("/pay", payRouter);



export { router as routes };
