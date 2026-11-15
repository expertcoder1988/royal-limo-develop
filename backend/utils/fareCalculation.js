import { MAPS_API_KEY } from "./constants.js";
import axios from "axios";
export const calculateTimeBased = (
  vehicle,
  pickupTime,
  dropoffTime,
  passengers,
  babySeats
) => {
  const pickup = new Date(pickupTime);
  const drop = new Date(dropoffTime);

  const timeDiff = Math.abs(drop - pickup);
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  let fare = 0;
  let seats = babySeats === "" ? 0 : parseInt(babySeats);
  let seatsFare = seats * 20;

  if (
    vehicle === "cadillac_escalade" ||
    vehicle === "gmc_yukon" ||
    vehicle === "suburban"
  ) {
    fare = hoursDiff * 105;
    if (fare < 75) {
      fare = 75;
    }
  } else if (vehicle === "black_Sedan") {
    fare = hoursDiff * 90;
    if (fare < 75) {
      fare = 75;
    }
  } else {
    throw new Error("Invalid vehicle");
  }
  fare = fare + seatsFare;
  fare = fare.toFixed(2);
  return fare;
};

export const calculatePointtoPoint = async (
  vehicle,
  pointA,
  pointB,
  passengers,
  babySeats
) => {
  let fare = 0;

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${pointA}&destinations=${pointB}&key=${MAPS_API_KEY}`;

    const response = await axios.get(apiUrl);

    let distance = Math.round(
      response.data.rows[0].elements[0].distance.value / 1609
    );

    if (distance > 0 && distance <= 10) {
      fare = 75;
    } else if (distance > 10 && distance <= 15) {
      fare = 95;
    } else if (distance > 15) {
      if (
        vehicle === "cadillac_escalade" ||
        vehicle === "gmc_yukon" ||
        vehicle === "suburban"
      ) {
        let disfare = distance * 4.5;
        let seats = babySeats === "" ? 0 : parseInt(babySeats);
        let seatsfare = seats * 20;
        fare = disfare + seatsfare;
      } else if (vehicle === "black_Sedan") {
        let disfare = distance * 3.5;
        let seatsfare = parseInt(babySeats) * 20;
        fare = disfare + seatsfare;
      } else {
        throw new Error("Invalid vehicle");
      }
    } else {
      throw new Error("Distance cannot be zero or below zero");
    }
    return fare;
  } catch (error) {
    throw new Error(error);
  }
};
