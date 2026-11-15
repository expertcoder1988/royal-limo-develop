"use client";
import SquareSDK from "@/SquareSDk/SquareSDK";
import { APIHeaders, backendURL } from "@/constants/bankendURL";
import { vehicleNameImage } from "@/constants/staticInfo";
import { calculateTimeBased } from "@/utils/fareCalculation";
import { IconTimeDuration10 } from "@tabler/icons-react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import MySavedCards from "./MySavedCards";

const seatRate = 20;

const BookingPreview = ({
  form,
  bookingMutation,
  withPayment,
  setDisabledStep,
  setActiveStep,
}: {
  form: any;
  bookingMutation: any;
  withPayment: boolean;
  setDisabledStep: any;
  setActiveStep: any;
}) => {
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [cardId, setCardId] = useState("new");
  const [totalFare, setTotalFare] = useState(0);
  const [totalQuote, setTotalQuote] = useState(0);
  const [gratuity, setGratuity] = useState(0);
  const [disableConfirm, setDisableConfirm] = useState(false);
  const calculatePointToPoint = async () => {
    const fare = await axios
      .post(
        backendURL + "/booking/calculate-point-to-point",
        {
          vehicle: form.getValues().vehicle,
          pickupPoint: form.getValues().pickupPoint,
          dropoffPoint: form.getValues().dropoffPoint,
          passengers: form.getValues().passengers,
          babySeats: form.getValues().babySeats,
        },
        {
          headers: APIHeaders(),
        }
      )
      .catch((err) => {
        if (err.response) {
          setDisableConfirm(true);
          setActiveStep(2);
          setDisabledStep(2);
          toast.error(
            err?.response.data?.errors || "Error While Calculating Fare",
            {
              description: "Please select a valid location and try again.",
              action: {
                label: "Retry",
                onClick: () => {
                  setActiveStep(2);
                  setDisabledStep(2);
                },
              },
            }
          );
        }
      });

    return fare;
  };

  useEffect(() => {
    // if (
    //   form.getValues("bookingType") === "to" ||
    //   form.getValues("bookingType") === "from"
    // ) {
    //   const babySeatsCost =
    //     parseInt(form.getValues().babySeats || 0) * seatRate;
    //   const fare = 280 + babySeatsCost;
    //   const gratuity = (fare * 0.2).toFixed(2);
    //   const total = (parseFloat(fare as any) + parseFloat(gratuity)).toFixed(2);
    //   setTotalFare(fare);
    //   setTotalQuote(total as any);
    //   setGratuity(gratuity as any);
    //   return;
    // }
    if (
      form.getValues("bookingType") === "point" ||
      form.getValues("bookingType") === "to" ||
      form.getValues("bookingType") === "from"
    ) {
      calculatePointToPoint().then((res) => {
        setTotalFare(res?.data?.fare || 0);
        setTotalQuote(res?.data?.totalFare || 0);
        setGratuity(res?.data?.gratuity || 0);
      });
    }
    if (form.getValues("bookingType") === "multiple") {
      setTotalFare(1);
      setTotalQuote(1);
      setGratuity(0);
    }
    if (form.getValues("bookingType") === "time_based") {
      const fare = calculateTimeBased(
        form.getValues().vehicle,
        form.getValues().pickupTime.replace("T", " "),
        form.getValues().dropoffTime.replace("T", " "),
        parseInt(form.getValues().passengers),
        parseInt(form.getValues().babySeats || 0)
      );
      setTotalFare(Number(fare.fare));
      setTotalQuote(Number(fare.total));
      setGratuity(Number(fare.gratuity));
    }
  }, []);
  const router = useRouter();
  const pathname = usePathname() || "";
  const bookingType =
    form.getValues("bookingType") === "time_based"
      ? "Time Based"
      : form.getValues("bookingType") === "to"
      ? "To Airport"
      : form.getValues("bookingType") === "from"
      ? "From Airport"
      : // : form.getValues("bookingType") === "multiple"
        // ? "Multiple Days"
        "Point to Point";

  const vehicleImage = vehicleNameImage(form.getValues("vehicle"))?.image;
  const pickupDate = new Date(
    form.getValues("pickupTime")?.replace("T", " ")
  ).toDateString();
  const pickupTime = new Date(
    form.getValues("pickupTime")?.replace("T", " ")
  ).toLocaleTimeString();

  const dropoffDate = new Date(
    form.getValues("dropoffTime")?.replace("T", " ")
  ).toDateString();
  const dropoffTime = new Date(
    form.getValues("dropoffTime")?.replace("T", " ")
  ).toLocaleTimeString();
  return (
    <div className="p-8 rounded-xl bg-white text-secondary mt-8">
      <div className="md:grid grid-cols-2 gap-16">
        <div className="flex flex-col gap-4">
        <img
    src={vehicleImage as string}
    alt="car"
    title="car"
    className="w-56 h-40 object-contain"
    style={{
      transform: "scaleX(-1)",
    }}
  />
          <h1 className="text-2xl fornt-bold">
            {vehicleNameImage(form.getValues("vehicle"))?.name}
          </h1>
          <div className="md:flex items-center gap-2">
            <p className="font-medium text-[18px]">Booking Type:</p>
            <p>{bookingType}</p>
          </div>

          {(form.getValues().bookingType === "time_based" ||
            form.getValues().bookingType === "multiple" ||
            form.getValues().bookingType === "point" ||
            form.getValues().bookingType === "from") && (
            <div className="flex max-md:flex-col items-center gap-2 ">
              <IconTimeDuration10 size={16} className="max-md:hidden" />
              <span className="font-medium">Pick up:</span>
              {pickupDate}
              <div className="h-4 w-[2px] bg-black"></div>
              <span className="font-medium">Time:</span>
              {pickupTime}
            </div>
          )}
          {(form.getValues().bookingType === "time_based" ||
            form.getValues().bookingType === "to" ||
            form.getValues().bookingType === "multiple") && (
            <div className="flex max-md:flex-col items-center gap-2 ">
              <IconTimeDuration10 size={16} className="max-md:hidden" />
              <span className="font-medium">Drop off:</span>
              {dropoffDate}
              <div className="h-4 w-[2px] bg-black"></div>
              <span className="font-medium">Time:</span>
              {dropoffTime}
            </div>
          )}
          {(form.getValues().bookingType === "to" ||
            form.getValues().bookingType === "from" ||
            form.getValues().bookingType === "point") && (
            <div>
              <div className="space-y-2">
                <p className="font-medium text-[18px] mb-2">Pick up Location</p>

                <p>{form.getValues("pickupPoint")}</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-[18px] mb-2">
                  Drop off Location
                </p>

                <p>{form.getValues("dropoffPoint")}</p>
              </div>
            </div>
          )}
          {form.getValues("notes") && (
            <div className="space-y-2 ">
              <p className="font-medium text-[18px] mb-2">Additional Notes</p>
              <p className="w-3/4 break-words">{form.getValues("notes")}</p>
            </div>
          )}
          {withPayment && (
            <MySavedCards
              setCardId={setCardId}
              setUseSavedCard={setUseSavedCard}
              cardId={cardId}
            />
          )}
        </div>
        <div>
          <div className="space-y-8">
            {/* <div>
              <p className="font-medium text-[18px]">More Details</p>
              <div className="flex items-center gap-2">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Lougage:</span>
                  {form.getValues("luggage")}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Passenger:</span>
                  {form.getValues("passengers")}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Baby Seat:</span>
                  {form.getValues("babySeats")}
                </p>
              </div>
            </div> */}
            <div className="space-y-2">
              <p className="font-medium text-[18px] mb-2">
                Personal Information
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">First Name:</span>
                {form.getValues("firstname")}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Last Name:</span>
                {form.getValues("lastname")}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                {form.getValues("email")}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Phone:</span>
                {form.getValues("phone_number")}
              </p>
            </div>
            <BookingCharges
              form={form}
              totalFare={totalFare}
              gratuity={gratuity}
              totalQuote={totalQuote}
            />
            {withPayment && (
              <div>
                <div>
                  <p className="font-medium text-[18px] mb-2">Payment Method</p>

                  <RadioGroup
                    onValueChange={(value) => {
                      form.setValue("paymentType", value);
                    }}
                    defaultValue={
                      form.getValues().bookingType !== "multiple"
                        ? "Advance"
                        : "on_spot"
                    }
                    className="lg:flex gap-4"
                  >
                    {form.getValues().bookingType !== "multiple" && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-xl border-2 p-4 md:w-64">
                          <RadioGroupItem
                            value={"Advance"}
                            className="cursor-pointer"
                          />
                          <p>{"Pay in Advance"}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 rounded-xl border-2 p-4 md:w-64">
                        <RadioGroupItem
                          value={"on_spot"}
                          className="cursor-pointer"
                        />
                        <p>{"Pay on Spot ($1)"}</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                {!useSavedCard && (
                  <div>
                    <SquareSDK bookingMutation={bookingMutation} form={form} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {!withPayment && (
        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant={"outline"}
            onClick={() => {
              setActiveStep(2);
            }}
          >
            Back
          </Button>
          <Button
            disabled={disableConfirm}
            onClick={() => {
              localStorage.setItem(
                "bookingDetails",
                JSON.stringify(form.getValues())
              );
              if (localStorage.getItem("authToken")) {
                setActiveStep(4);
                setDisabledStep(4);
              } else {
                router.push(`/login?from=${encodeURI(pathname)}`);
              }
            }}
          >
            Confirm Booking
          </Button>
        </div>
      )}
      {useSavedCard && (
        <div className="flex justify-end gap-4 mt-4">
          <Button
            onClick={() => {
              form.setValue("saveCardDetails", false);
              bookingMutation(cardId);
            }}
          >
            Book Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingPreview;
export const BookingCharges = ({
  form,
  totalFare,
  gratuity,
  totalQuote,
}: {
  form: any;
  totalFare: any;
  gratuity: any;
  totalQuote: any;
}) => {
  return (
    <div>
      <div className="space-y-2">
        <p className="font-medium text-[18px] mb-2">Charges</p>
        <div className="flex justify-between items-center">
          <p className="flex font-medium items-center gap-2">
            Luggage x {form.getValues("luggage") || 0}:
          </p>
          <div className="border-[1px] border-dashed w-80"></div>
          <p>
            ${""}
            {form.getValues("luggage") * 0}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="flex font-medium items-center gap-2">
            Passengers x {form.getValues("passengers")}:
          </p>
          <div className="border-[1px] border-dashed w-80"></div>
          <p>
            ${""}
            {form.getValues("passengers") * 0}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="flex font-medium items-center gap-2">
            Child Seats x {form.getValues("babySeats") || 0}:
          </p>
          <div className="border-[1px] border-dashed w-80"></div>
          <p>
            ${""}
            {form.getValues("babySeats") * seatRate}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="flex items-center gap-2">
            <span className="font-medium">Total Fare:</span>
          </p>
          <div className="border-[1px] border-dashed w-80"></div>
          <p>
            ${""}
            {totalFare}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="flex items-center gap-2">
            <span className="font-medium">Gratuity:</span>
          </p>
          <div className="border-[1px] border-dashed w-80"></div>
          <p>
            ${""}
            {gratuity}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="flex font-medium items-center gap-2">Tax:</p>
          <div className="border-[1px] border-dashed w-80"></div>
          <p>
            ${""}
            {0}
          </p>
        </div>
      </div>
      <div className="border-[2px] mt-8"></div>
      <div className="flex justify-between items-center">
        <p className="font-medium text-[20px]">Total Quote</p>
        <p className="font-medium text-[20px]">
          {" "}
          ${""}
          {totalQuote}
        </p>
      </div>
    </div>
  );
};
