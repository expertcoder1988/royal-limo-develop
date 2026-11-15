import mongoose from "mongoose";

const { Schema } = mongoose;

const BookingsSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Point to Point",
        "Time Based",
        "Multiple Days",
        "From Airport",
        "To Airport",
      ],
      required: true,
    },
    vehicle: {
      type: String,
      enum: ["cadillac_escalade", "gmc_yukon", "suburban", "black_Sedan"],
      required: true,
    },
    pickupPoint: {
      type: String,
    },
    dropoffPoint: {
      type: String,
    },
    pickupTime: {
      type: Date,
    },
    dropoffTime: {
      type: Date,
    },
    pickupDate: {
      type: Date,
    },
    dropoffDate: {
      type: Date,
    },
    date: {
      type: Date,
    },
    fare: {
      type: Number,
      required: true,
    },
    paidFare: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
    paymentStatus: {
      type: String,
      enum: ["partially_paid", "fully_paid"],
      default: "fully_paid",
    },
    passengers: {
      type: Number,
    },
    luggage: {
      type: Number,
    },
    babySeats: {
      type: Number,
    },
    notes: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("booking", BookingsSchema);
