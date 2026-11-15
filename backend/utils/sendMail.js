import nodemailer from "nodemailer";
import { SENDER_EMAIL, SENDER_EMAIL_PASSWORD } from "./constants.js";

const transporter = nodemailer.createTransport({
  host: "mail.your-server.de",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_EMAIL_PASSWORD,
  },
});

export const sendMail = (email, subject, message) => {
  try {
    const mailOptions = {
      from: "noreply@royallimoco.com",
      to: email,
      subject,
      text: message,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unable to send an email. ");
  }
};

export const formatBookingMail = (savedBooking) => {
  return `
  Hello Admin,

  A new booking has been made on Royal Limo Co. Here are the details:

  Booking ID: ${savedBooking._id}
  User ID: ${savedBooking.user}
  Name: ${savedBooking.firstname} ${savedBooking.lastname}
  Email: ${savedBooking.email}
  Phone Number: ${savedBooking.phoneNo}
  Service Type: ${savedBooking.type}
  Vehicle Type: ${
    savedBooking.vehicle.charAt(0).toUpperCase() +
    savedBooking.vehicle.slice(1).replace("_", " ")
  }
  Pickup Point: ${savedBooking.pickupPoint}
  Dropoff Point: ${savedBooking.dropoffPoint}
  Pickup Time: ${new Date(savedBooking.pickupTime).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  })} (UTC)
  Fare: $${savedBooking.fare.toFixed(2)}
  Paid Fare: $${savedBooking.paidFare.toFixed(2)}
  Status: ${
    savedBooking.status.charAt(0).toUpperCase() + savedBooking.status.slice(1)
  }
  Payment Status: ${savedBooking.paymentStatus.replace("_", " ")}
  Number of Passengers: ${savedBooking.passengers}
  Luggage: ${savedBooking.luggage} pieces
  Baby Seats: ${savedBooking.babySeats}
  Booking Created At: ${new Date(savedBooking.createdAt).toLocaleString(
    "en-US",
    {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "UTC",
    }
  )}
  Last Updated At: ${new Date(savedBooking.updatedAt).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  })}

  Please review and confirm the booking details.

  Best regards,
  Royal Limo Co Booking System
  `;
};
