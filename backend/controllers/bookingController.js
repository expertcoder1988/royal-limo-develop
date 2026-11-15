import Booking from "../models/bookings.js";
import User from "../models/users.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants.js";
import users from "../models/users.js";
import adminSchema from "../models/admin.js";

export const getBookings = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const filters = {};
  const sortOptions = {};

  if (req.query.type) {
    filters.type = req.query.type;
  }

  if (req.query.vehicle) {
    filters.vehicle = req.query.vehicle;
  }

  if (req.query.status) {
    filters.status = req.query.status;
  }

  if (req.query.isPaid) {
    filters.isPaid = req.query.isPaid;
  }

  if (req.query.passengersMin || req.query.passengersMax) {
    filters.passengers = {};
    if (req.query.passengersMin) {
      filters.passengers.$gte = parseInt(req.query.passengersMin);
    }
    if (req.query.passengersMax) {
      filters.passengers.$lte = parseInt(req.query.passengersMax);
    }
  }

  if (req.query.babySeatsMin || req.query.babySeatsMax) {
    filters.babySeats = {};
    if (req.query.babySeatsMin) {
      filters.babySeats.$gte = parseInt(req.query.babySeatsMin);
    }
    if (req.query.babySeatsMax) {
      filters.babySeats.$lte = parseInt(req.query.babySeatsMax);
    }
  }

  if (req.query.luggageMin || req.query.luggageMax) {
    filters.luggage = {};
    if (req.query.luggageMin) {
      filters.luggage.$gte = parseInt(req.query.luggageMin);
    }
    if (req.query.luggageMax) {
      filters.luggage.$lte = parseInt(req.query.luggageMax);
    }
  }

  if (req.query.sortBy) {
    const sortBy = req.query.sortBy;
    sortOptions[sortBy] = req.query.sortOrder === "desc" ? -1 : 1;
  } else {
    sortOptions.date = 1;
  }

  try {
    const totalCount = await Booking.countDocuments(filters);
    const totalPages = Math.ceil(totalCount / pageSize);

    const data = await Booking.find(filters)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      data,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const filters = { user: userId };
  const sortOptions = {};

  if (req.query.type) {
    filters.type = req.query.type;
  }

  if (req.query.vehicle) {
    filters.vehicle = req.query.vehicle;
  }

  if (req.query.status) {
    filters.status = req.query.status;
  }

  if (req.query.isPaid) {
    filters.isPaid = req.query.isPaid;
  }

  if (req.query.passengersMin || req.query.passengersMax) {
    filters.passengers = {};
    if (req.query.passengersMin) {
      filters.passengers.$gte = parseInt(req.query.passengersMin);
    }
    if (req.query.passengersMax) {
      filters.passengers.$lte = parseInt(req.query.passengersMax);
    }
  }

  if (req.query.babySeatsMin || req.query.babySeatsMax) {
    filters.babySeats = {};
    if (req.query.babySeatsMin) {
      filters.babySeats.$gte = parseInt(req.query.babySeatsMin);
    }
    if (req.query.babySeatsMax) {
      filters.babySeats.$lte = parseInt(req.query.babySeatsMax);
    }
  }

  if (req.query.luggageMin || req.query.luggageMax) {
    filters.luggage = {};
    if (req.query.luggageMin) {
      filters.luggage.$gte = parseInt(req.query.luggageMin);
    }
    if (req.query.luggageMax) {
      filters.luggage.$lte = parseInt(req.query.luggageMax);
    }
  }

  if (req.query.sortBy) {
    const sortBy = req.query.sortBy;
    sortOptions[sortBy] = req.query.sortOrder === "desc" ? -1 : 1;
  } else {
    sortOptions.date = 1;
  }

  try {
    const totalCount = await Booking.countDocuments(filters);
    const totalPages = Math.ceil(totalCount / pageSize);

    const data = await Booking.find(filters)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      data,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getBooking = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .send({ error: "Please Authenticate using a valid token" });
    }
    const data = jwt.verify(token, JWT_SECRET);
    let user = await users.findById(data.user.id);
    let admin = await adminSchema.findById(data.user.id);
    if (!user && !admin) {
      return res
        .status(401)
        .send({ error: "Please Authenticate using a valid token" });
    }
    const booking = await Booking.findById(req.params.bookingId);
    if (booking.user.toString() === user?.id || admin) {
      return res.status(200).json(booking);
    } else {
      return res
        .status(401)
        .send({ error: "Please Authenticate using a valid token" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const user = await User.findById(req.user.id).select("-password");

    const booking = await Booking.findById(bookingId);

    if (user.id !== booking.user.toString()) {
      return res
        .status(401)
        .json({ errors: "Unauthorized to cancel this booking" });
    }

    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ errors: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: "Failed to delete booking" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .send({ error: "Please Authenticate using a valid token" });
    }
    const data = jwt.verify(token, JWT_SECRET);
    let user = await users.findById(data.user.id);
    let admin = await adminSchema.findById(data.user.id);
    if (!user && !admin) {
      return res
        .status(401)
        .send({ error: "Please Authenticate using a valid token" });
    }

    const booking = await Booking.findById(bookingId);

    if (booking.user.toString() === user?.id || admin) {
      if (booking.status === "completed") {
        return res
          .status(400)
          .json({ errors: "Cannot mark completed bookings as cancelled" });
      }
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: "cancelled" },
        { new: true }
      );

      if (!updatedBooking) {
        return res.status(404).json({ errors: "Booking not found" });
      }

      res.json(updatedBooking);
    } else {
      return res
        .status(401)
        .send({ error: "Please Authenticate using a valid token" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: "Failed to cancel booking" });
  }
};
