//@ts-nocheck
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
  const gratuity = (fare * 0.2).toFixed(2);
  const total = (parseFloat(fare) + parseFloat(gratuity)).toFixed(2);
  return { total, fare, gratuity };
};
