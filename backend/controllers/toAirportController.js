import Booking from "../models/bookings.js";
import User from "../models/users.js";
import { makePayment } from "../utils/payment.js";
import { formatBookingMail, sendMail } from "../utils/sendMail.js";
export const createToAirportBooking = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(req.user.id).select("-password");

    let {
      firstname,
      lastname,
      email,
      phoneNo,
      vehicle,
      pickupPoint,
      dropoffPoint,
      dropoffTime,
      passengers,
      luggage,
      babySeats,
      token,
      paymentType,
      notes,
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
    if (!dropoffTime) missingFields.push("dropoffTime");
    if (!passengers) missingFields.push("passengers");
    if (luggage === 0 || luggage === null || luggage === undefined) luggage = 0;
    if (babySeats === 0 || babySeats === null || babySeats === undefined)
      babySeats = 0;
    if (!token) missingFields.push("token");
    if (!paymentType) missingFields.push("paymentType");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ errors: `Missing fields: ${missingFields.join(", ")}` });
    }

    let seatsFare = babySeats * 20;
    let fare = 280 + seatsFare;
    let totalFare = (fare * 0.2).toFixed(2);
    try {
      await makePayment(
        token,
        paymentType === "Advance" ? parseInt(totalFare) : 1,
        userId,
        cardholderName,
        saveCard,
        req.user
      );
    } catch (paymentError) {
      return res.status(400).json({ errors: paymentError.message });
    }

    const newBooking = new Booking({
      user: userId,
      firstname,
      lastname,
      email,
      phoneNo,
      type: "To Airport",
      vehicle,
      pickupPoint,
      dropoffPoint,
      dropoffTime,
      date: dropoffTime,
      passengers,
      luggage,
      babySeats,
      notes,
      fare: paymentType === "Advance" ? parseInt(totalFare) : 1,
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

export const editToAirportBooking = async (req, res) => {
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
      dropoffTime,
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
      dropoffTime,
      date: dropoffTime,
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
