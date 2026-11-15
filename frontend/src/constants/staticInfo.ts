export const companyPhone = "651-890-2400";
export const companyEmail = "help@royallimoco.com";
export const companyLocation = "16632 English Path Lakeville MN, 55044";
export const headingStyle =
  "font-bold text-[32px] leading-9 flex items-center justify-center text-center lg:mx-[400px] uppercase";
export const headingStyle2 =
  "font-semibold text-[32px] leading-9 flex items-center justify-center text-center  text-primary uppercase";
import car1 from "../assets/car1.webp";
import car2 from "../assets/car2.webp";
import car3 from "../assets/car3.webp";
import sedan from "../assets/sedan.webp";
import why1 from "../assets/why1.webp";
import why2 from "../assets/why2.webp";
import why3 from "../assets/why3.webp";
import why4 from "../assets/why4.webp";
import why5 from "../assets/why5.webp";

export const vehicleDetails = [
  {
    value: "cadillac_escalade",
    name: "Cadillac Escalade",
    model: "2021",
    description:
      "Spacious and elegant, perfect for executive transportation or special occasions.",
    lougageCapacity: "6",
    passengerCapacity: "6",
    image: car2.src,
  },
  {
    value: "gmc_yukon",
    name: "GMC Yukon",
    model: "2021",
    description: "The 2021 GMC Yukon is a full-size SUV.",
    lougageCapacity: "6",
    passengerCapacity: "6",
    image: car1.src,
  },
  {
    value: "suburban",
    name: "Suburban",
    model: "2021",
    description: "The 2021 Suburban is a full-size SUV.",
    lougageCapacity: "6",
    passengerCapacity: "6",
    image: car3.src,
  },
  {
    value: "black_Sedan",
    name: "Black Sedan",
    model: "2021",
    description: "The 2021 Black Sedan is a full-size luxury sedan.",
    lougageCapacity: "3",
    passengerCapacity: "3",
    image: sedan.src,
  },
];
export const bookingTypes = [
  {
    value: "time_based",
    name: "Time Based",
    description:
      "Book a vehicle for a specific duration and enjoy a flexible and convenient ride.",
  },
  {
    value: "point",
    name: "Point to Point",
    description:
      "Get picked up and dropped off at your desired location without any stops in between.",
  },
  // {
  //   value: "multiple",
  //   name: "Multiple Days",
  //   description:
  //     "Book a vehicle for multiple days and enjoy a flexible and convenient ride.",
  // },
  {
    value: "to",
    name: "To Airport",
    description:
      "Relax and arrive on time with reliable airport transportation to all major airports.",
  },
  {
    value: "from",
    name: "From Airport",
    description:
      "Enjoy a stress-free airport experience with reliable pick-up and drop-off.",
  },
];

export const whyRoyalLimo = [
  {
    name: "Professional Chauffeurs",
    image: why1.src,
    description:
      "Experience surpasses expectations. Our chauffeurs are highly trained,background-checked, and committed to providing a safe, comfortable, and discreet ride.",
  },
  {
    name: "Luxurious Vehicles",
    image: why2.src,
    description:
      "Ride in unparalleled comfort and style. Our meticulously maintained fleet boasts the latest models from prestigious brands.",
  },
  {
    name: "Competitive Rates",
    image: why3.src,
    description:
      "Luxury shouldn't bre ak the bank. We offer transparent pricing and a variety of packages to suit your budget and specific needs.",
  },
  {
    name: "Professional Chauffeurs",
    image: why4.src,
    description:
      "Experience surpasses expectations. Our chauffeurs are highly trained,background-checked, and committed to providing a safe, comfortable, and discreet ride.",
  },
  {
    name: "Luxurious Vehicles",
    image: why5.src,
    description:
      "Ride in unparalleled comfort and style. Our meticulously maintained fleet boasts the latest models from prestigious brands.",
  },
];

export const testimonials = [
  {
    name: "John Doe",
    rating: 5,
    image:
      "https.src://img.freepik.com/free-photo/luxury-car-speeds-by-modern-building-dusk-generative-ai_188544-8048.webp",
    description:
      "We booked Royal Limo for our daughter's prom night, and it was truly the highlight     of the evening!",
  },
  {
    name: "John Doe",
    rating: 5,
    image:
      "https.src://img.freepik.com/free-photo/luxury-car-speeds-by-modern-building-dusk-generative-ai_188544-8048.webp",
    description:
      "My recent  airport transfer was a breeze! The driver was waiting for me right outside     baggage claim, assisted with my luggage, and got me home safely and efficiently. I will definitely use Royal Limo again.",
  },
  {
    name: "John Doe",
    rating: 5,
    image:
      "https.src://img.freepik.com/free-photo/luxury-car-speeds-by-modern-building-dusk-generative-ai_188544-8048.webp",
    description:
      "Our company recently used Royal Limo for executive transportation to a critical client     meeting. Not only were the vehicles impeccably clean and luxurious, but the chauffeurs were also professional and courteous and ensured everyone arrived on time and relaxed",
  },
];

export const carTypes = [
  { label: "Cadillac Escalade", value: "cadillac_escalade", car: car2 },
  { label: "GMC Yukon", value: "gmc_yukon", car: car1 },
  { label: "Suburban", value: "suburban", car: car3 },
  { label: "Black Sedan", value: "black_Sedan", car: sedan },
];

export const vehicleNameImage = (vehicle: string) => {
  if (!vehicle) return;
  switch (vehicle) {
    case "cadillac_escalade":
      return {
        name: "Cadilac Esclade",
        image: car2.src,
      };
    case "black_Sedan":
      return {
        name: "Black Sedan",
        image: sedan.src,
      };
    case "gmc_yukon":
      return {
        name: "GMC Yukon",
        image: car1.src,
      };
    case "suburban":
      return {
        name: "Suburban",
        image: car3.src,
      };

    default:
      return {
        name: "GMC Yukon",
        image: car1.src,
      };
  }
};
