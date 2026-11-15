import Booking from "../models/bookings.js";
import User from "../models/users.js";
import { calculatePointtoPoint } from "../utils/fareCalculation.js";
import { makePayment } from "../utils/payment.js";
import { formatBookingMail, sendMail } from "../utils/sendMail.js";
export const createPointToPointBooking = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(req.user.id).select("-password");

    let {
      firstname,
      lastname,
      email,
      bookingType,
      phoneNo,
      vehicle,
      pickupPoint,
      dropoffPoint,
      date,
      dropoffTime,
      pickupTime,
      passengers,
      luggage,
      babySeats,
      token,
      notes,
      paymentType,
      saveCard,
      cardholderName,
    } = req.body;

    const missingFields = [];

    if (!user) missingFields.push("user");
    if (!firstname) missingFields.push("firstname");
    if (!lastname) missingFields.push("lastname");
    if (!email) missingFields.push("email");
    if (!phoneNo) missingFields.push("phoneNo");
    if (!vehicle) missingFields.push("vehicle");
    if (!pickupPoint) missingFields.push("pickupPoint");
    if (!dropoffPoint) missingFields.push("dropoffPoint");
    if (!passengers) missingFields.push("passengers");
    if (luggage === 0 || luggage === null || luggage === undefined) luggage = 0;
    if (babySeats === 0 || babySeats === null || babySeats === undefined)
      babySeats = 0;
    if (!token) missingFields.push("token");
    if (!paymentType) missingFields.push("paymentType");
    if (bookingType === "point") if (!date) missingFields.push("date");
    if (bookingType === "to")
      if (!dropoffTime) missingFields.push("dropoffTime");
    if (bookingType === "from")
      if (!pickupTime) missingFields.push("pickupTime");
    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ errors: `Missing fields: ${missingFields.join(", ")}` });
    }

    let fare = await calculatePointtoPoint(
      vehicle,
      pickupPoint,
      dropoffPoint,
      passengers,
      babySeats
    );

    let gratuity = parseInt(fare) * 0.2;
    let totalFare = (parseInt(fare) + gratuity).toFixed(2);
    const amountToPay = Math.round(paymentType === "Advance" ? totalFare : 1);

    try {
      await makePayment(
        token,
        amountToPay,
        userId,
        cardholderName,
        saveCard,
        req.user
      );
    } catch (paymentError) {
      return res.status(400).json({ errors: "Payment was declined" });
    }

    let type;
    switch (bookingType) {
      case "to":
        type = "To Airport";
        break;
      case "from":
        type = "From Airport";
        break;
      case "point":
      default:
        type = "Point to Point";
        break;
    }

    const newBooking = new Booking({
      user: userId,
      firstname,
      lastname,
      email,
      phoneNo,
      type,
      vehicle,
      pickupPoint,
      dropoffPoint,
      date,
      dropoffTime,
      pickupTime,
      passengers,
      luggage,
      babySeats,
      notes,
      fare: totalFare,
      paidFare: amountToPay,
      paymentStatus:
        paymentType === "Advance" ? "fully_paid" : "partially_paid",
    });

    const savedBooking = await newBooking.save();

    sendMail(
      process.env.RECIPIENT_EMAIL,
      "Booking made",
      formatBookingMail(savedBooking)
    );

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: "Failed to create booking" });
  }
};

export const editPointToPointBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const user = await User.findById(req.user.id).select("-password");

    const booking = await Booking.findById(bookingId);

    if (user.id !== booking.user.toString()) {
      return res
        .status(401)
        .json({ errors: "Unauthorized to edit this booking" });
    }

    const {
      firstname,
      lastname,
      email,
      phoneNo,
      vehicle,
      pickupPoint,
      dropoffPoint,
      date,
      passengers,
      luggage,
      babySeats,
    } = req.body;

    const updatedFields = {
      firstname,
      lastname,
      email,
      phoneNo,
      vehicle,
      pickupPoint,
      dropoffPoint,
      date,
      passengers,
      luggage,
      babySeats,
    };

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updatedFields,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ errors: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: "Failed to update booking" });
  }
};

export const calculatePointtoPointFare = async (req, res) => {
  try {
    const { vehicle, pickupPoint, dropoffPoint, passengers, babySeats } =
      req.body;

    if (!vehicle || !pickupPoint || !dropoffPoint || !passengers) {
      return res
        .status(400)
        .json({ errors: "All required fields must be provided" });
    }

    if (babySeats === 0 || babySeats === null || babySeats === undefined)
      babySeats = 0;

    let fare = await calculatePointtoPoint(
      vehicle,
      pickupPoint,
      dropoffPoint,
      passengers,
      babySeats
    );

    console.log(fare);
    let gratuity = parseInt(fare) * 0.2;
    let totalFare = (parseInt(fare) + gratuity).toFixed(2);

    res.status(200).json({
      babySeats: babySeats * 20,
      fare: fare,
      gratuity: gratuity.toFixed(2),
      totalFare: totalFare,
    });
  } catch (error) {
    res.status(500).json({ errors: "Failed to calculate fare" });
  }
};
