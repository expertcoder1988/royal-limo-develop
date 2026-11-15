import express from "express";
import {
  calculatePointtoPointFare,
  createPointToPointBooking,
  editPointToPointBooking,
} from "../controllers/pointToPointController.js";
import { fetchUser } from "../middlewares/fetchUser.js";
import {
  calculateTimeBasedFare,
  createTimeBasedBooking,
  editTimeBasedBooking,
} from "../controllers/timeBasedController.js";
import {
  createMultipleDaysBooking,
  editMultipleDaysBooking,
} from "../controllers/multipleDaysController.js";
import {
  cancelBooking,
  deleteBooking,
  getBooking,
  getBookings,
  getMyBookings,
} from "../controllers/bookingController.js";
import {
  createToAirportBooking,
  editToAirportBooking,
} from "../controllers/toAirportController.js";
import {
  createFromAirportBooking,
  editFromAirportBooking,
} from "../controllers/fromAirportController.js";
import { calculatePointtoPoint } from "../utils/fareCalculation.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";

const router = express.Router();

router.route("/").get(checkAdmin, getBookings);

router.route("/my-bookings").get(fetchUser, getMyBookings);

router.route("/:bookingId").get(getBooking);

router.route("/:bookingId").delete(fetchUser, deleteBooking);

//point to point

router.route("/point-to-point").post(fetchUser, createPointToPointBooking);

router
  .route("/point-to-point/:bookingId")
  .put(fetchUser, editPointToPointBooking);

router.route("/calculate-point-to-point").post(calculatePointtoPointFare);

//time based

router.route("/time-based").post(fetchUser, createTimeBasedBooking);

router.route("/time-based/:bookingId").put(fetchUser, editTimeBasedBooking);

router.route("/calculate-time-based").post(calculateTimeBasedFare);

//multiple days

router.route("/multiple-days").post(fetchUser, createMultipleDaysBooking);

router
  .route("/multiple-days/:bookingId")
  .put(fetchUser, editMultipleDaysBooking);

//to airport

router.route("/to-airport").post(fetchUser, createToAirportBooking);

router.route("/to-airport/:bookingId").put(fetchUser, editToAirportBooking);

//from airport

router.route("/from-airport").post(fetchUser, createFromAirportBooking);

router.route("/from-airport/:bookingId").put(fetchUser, editFromAirportBooking);

router.route("/cancel/:bookingId").put(cancelBooking);

export { router as bookingRouter };
