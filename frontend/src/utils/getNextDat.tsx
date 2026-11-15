export const calculateNext24HoursFromDate = (givenDateTime: any) => {
  if (
    givenDateTime === undefined ||
    givenDateTime === null ||
    givenDateTime === ""
  )
    return;
  const currentDate = new Date(givenDateTime);
  // Calculate the next 24 hours

  const next24Hours = new Date(currentDate.getTime() + 29 * 60 * 60 * 1000);
  // Extract the date and time components up to next 24 hours
  const next24HoursString = next24Hours.toISOString().slice(0, 16);
  // Return the next 24 hours date and time in ISO format
  return next24HoursString;
};
