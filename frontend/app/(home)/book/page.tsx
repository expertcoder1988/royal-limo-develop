// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

"use client";
import React from "react";
import BookingForm from "@/components/common/BookingForm";
import BookingPreview from "@/components/common/BookingPreview";
import BookingTypeCard from "@/components/common/BookingTypeCard";
import Loader from "@/components/common/Loader";
import Stepper from "@/components/common/Stepper";
import VehicleBookingCard from "@/components/common/VehicleBookingCard";
import { Button } from "@/components/ui/button";
import { backendURL } from "@/constants/bankendURL";
import { checkValidations } from "@/constants/formValidation";
import { routes } from "@/constants/routes";
import { bookingTypes, vehicleDetails } from "@/constants/staticInfo";
import BookingLayout from "@/layouts/BookingLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
const formSchema = z
  .object({
    firstname: z.string().min(2, "First Name must be at least 2 characters"),
    lastname: z.string().min(2, "Last Name must be at least 2 characters"),
    email: z.string().email("Invalid Email"),
    phone_number: z.string().optional(),
    notes: z.string().optional(),
    bookingType: z.string().optional(),
    vehicle: z.string().optional(),
    pickupPoint: z.string().optional(),
    dropoffPoint: z.string().optional(),
    pickupTime: z.string().optional(),
    dropoffTime: z.string().optional(),
    passengers: z.string().min(1, "Passengers must be at least 1"),
    luggage: z.string().optional(),
    babySeats: z.string().optional(),
    paymentType: z.enum(["Advance", "at_spot"]).optional(),
    saveCardDetails: z.boolean().optional(),
    cardholderName: z.string().optional(),
  })
  .refine((data) => {
    checkValidations(data);
    return true;
  });
const BookingPage = () => {
  const localStorage = typeof window !== "undefined" && window.localStorage;
  const auth_token = localStorage && localStorage.getItem("authToken");
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [disabledStep, setDisabledStep] = useState(1);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingType: "time_based",
      vehicle: "cadillac_escalade",
      firstname: "",
      lastname: "",
      email: "",
      phone_number: "",
      // pickupPoint: {},
      // dropoffPoint: {},
      passengers: "",
      luggage: "",
      babySeats: "",
      paymentType: "Advance",
      saveCardDetails: false,
    },
  });
  const onSubmit = (token: any) => {
    const data = form.getValues();
    const sendData = {
      bookingType: data.bookingType || "time_based",
      vehicle: data.vehicle,
      passengers: parseInt(data.passengers),
      luggage: parseInt(data.luggage || 0),
      babySeats: parseInt(data.babySeats || 0),
      paymentType: data.paymentType || "Advance",
      notes: data.notes,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      phoneNo: data.phone_number,
      token: token,
      saveCard: data.saveCardDetails,
    };
    if (data.bookingType === "time_based") {
      sendData["pickupTime"] = new Date(data.pickupTime).toISOString();
      sendData["dropoffTime"] = new Date(data.dropoffTime).toISOString();
    }
    if (data.bookingType === "point") {
      sendData["pickupPoint"] = data.pickupPoint;
      sendData["dropoffPoint"] = data.dropoffPoint;
      const date = data.pickupTime?.replace("T", " ");
      sendData["date"] = new Date(date).toISOString();
    }
    if (data.bookingType === "to") {
      sendData["pickupPoint"] = data.pickupPoint;
      sendData["dropoffPoint"] = data.dropoffPoint;
      const date = data.dropoffTime?.replace("T", " ");
      sendData["dropoffTime"] = new Date(date).toISOString();
    }
    if (data.bookingType === "from") {
      sendData["pickupPoint"] = data.pickupPoint;
      sendData["dropoffPoint"] = data.dropoffPoint;
      const date = data.pickupTime?.replace("T", " ");
      sendData["pickupTime"] = new Date(date).toISOString();
    }
    if (data.bookingType === "multiple") {
      const pickupDate = data.pickupTime?.replace("T", " ");
      const dropoffDate = data.dropoffTime?.replace("T", " ");
      sendData["pickupDate"] = new Date(pickupDate).toISOString();
      sendData["dropoffDate"] = new Date(dropoffDate).toISOString();
    }
    if (data.saveCardDetails) {
      sendData["cardholderName"] = data.cardholderName;
    }
    const url =
      data.bookingType === "time_based" ? "/time-based" : "/point-to-point";

    const resData = axios.post(`${backendURL}/booking${url}`, sendData, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    });
    return resData;
  };
  const { mutateAsync: bookingMutation, isPending } = useMutation({
    mutationFn: (token) => onSubmit(token),
    onSuccess: () => {
      localStorage && localStorage.removeItem("bookingDetails");
      toast.success("Vehicle Booked Successfully", {
        description: "Your vehicle has been booked successfully",
      });
      router.push(routes.myBookings);
    },
    onError: (error: { response: { data: { errors: string } } }) => {
      toast.error("An Error Occured!", {
        description: error?.response?.data?.errors,
      });
    },
  });

  useEffect(() => {
    if (localStorage && localStorage.getItem("bookingDetails")) {
      const data = JSON.parse(localStorage.getItem("bookingDetails")!);
      form.setValue("vehicle", data.vehicle);
      form.setValue("bookingType", data.bookingType);
      form.setValue("pickupPoint", data.pickupPoint);
      form.setValue("dropoffPoint", data.dropoffPoint);
      form.setValue("pickupTime", data.pickupTime);
      form.setValue("dropoffTime", data.dropoffTime);
      form.setValue("passengers", data.passengers);
      form.setValue("luggage", data.luggage);
      form.setValue("babySeats", data.babySeats);
      form.setValue("notes", data.notes);
      form.setValue("firstname", data.firstname);
      form.setValue("lastname", data.lastname);
      form.setValue("email", data.email);
      form.setValue("phone_number", data.phone_number);
      form.setValue("paymentType", data.paymentType);
      form.setValue("saveCardDetails", data.saveCardDetails);
      form.setValue("cardholderName", data.cardholderName);
      const activeStep =
        parseInt(data.activeStep) > 0 &&
        parseInt(data.activeStep) < 4 &&
        parseInt(data.activeStep);
      if (activeStep) {
        setActiveStep(activeStep);
        setDisabledStep(activeStep);
      } else if (data.isFromLandingPage) {
        setActiveStep(2);
        setDisabledStep(2);
      } else {
        setActiveStep(3);
        setDisabledStep(3);
      }
      // localStorage.removeItem("bookingDetails");
    }
  }, []);

  useEffect(() => {
    const locationMayo = "Mayo Clinic, 1216 2nd St SW, Rochester, MN 55902";

    const locationAirport =
      "MSP Terminal 1 Concourse A-Lindbergh, 4300 Glumack Dr, St Paul, MN 55111";

    if (form.getValues().bookingType === "to") {
      // form.setValue("pickupPoint", locationMayo);
      form.setValue("dropoffPoint", locationAirport);
      // ensures that Booking Type "To" is not affected by garbage values
      form.setValue("pickupTime", "");
      form.clearErrors("pickupTime");
    } else if (form.getValues().bookingType === "from") {
      form.setValue("pickupPoint", locationAirport);
      // form.setValue("dropoffPoint", locationMayo);
    }
  }, [form.watch("bookingType")]);

  return (
    <div className="container p-8 flex flex-col">
      <Loader isLoading={isPending} />
      <Stepper
        steps={["Vehicle", "Details", "Review", "Pay"]}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        disabled={disabledStep}
      />
      <div>
        {activeStep === 1 && (
          <BookingLayout>
            <HeadingInfo
              title="Choose Your Vehicle Type"
              description="Please select the vehicle you want to book from the following list"
            />
            <div className="flex flex-wrap justify-center gap-4 my-2">
              {vehicleDetails.map((vehicle, index) => (
                <div key={index}>
                  <VehicleBookingCard
                    key={index}
                    form={form}
                    vehicle={vehicle}
                  />
                </div>
              ))}
            </div>
            <HeadingInfo
              title="Choose Booking Type"
              description="Please select the booking type you want to book from the following list"
            />

            <div className="flex flex-wrap justify-center gap-4 my-4">
              {bookingTypes.map((type, index) => (
                <div key={index}>
                  <BookingTypeCard
                    key={index}
                    form={form}
                    bookingType={type}
                    setActiveStep={setActiveStep}
                    setDisabledStep={setDisabledStep}
                  />
                </div>
              ))}
            </div>
            {/* <GoogleMapComponent /> */}

            <div className="flex justify-end gap-4">
              <Button
                variant={"outline"}
                className="text-secondary w-24 bg-none bg-transparent border-secondary"
                onClick={() => {
                  router.push(routes.myBookings);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={"default"}
                className="w-24"
                onClick={() => {
                  const activeStep = JSON.parse(
                    localStorage.getItem("bookingDetails")
                  )?.activeStep;
                  localStorage.setItem(
                    "bookingDetails",
                    JSON.stringify({
                      ...form.getValues(),
                      activeStep: activeStep || 2,
                    })
                  );
                  setActiveStep(2);
                  setDisabledStep(2);
                }}
              >
                Next
              </Button>
            </div>
          </BookingLayout>
        )}
        {activeStep === 2 && (
          <BookingLayout>
            <HeadingInfo
              title="Booking Details"
              description="Please provide the following information to proceed further"
            />
            <BookingForm
              form={form}
              setActiveStep={setActiveStep}
              setDisabledStep={setDisabledStep}
            />
          </BookingLayout>
        )}
        {activeStep === 3 && (
          <BookingLayout>
            <HeadingInfo
              title="Review Booking"
              description="Please review the following information to proceed further"
            />
            <BookingPreview
              form={form}
              bookingMutation={bookingMutation}
              withPayment={false}
              setActiveStep={setActiveStep}
              setDisabledStep={setDisabledStep}
            />
          </BookingLayout>
        )}
        {activeStep === 4 && (
          <BookingLayout>
            <HeadingInfo
              title="Payment"
              description="Please provide the following information to proceed further"
            />
            <BookingPreview
              form={form}
              bookingMutation={bookingMutation}
              withPayment={true}
              setActiveStep={setActiveStep}
              setDisabledStep={setDisabledStep}
            />
          </BookingLayout>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
const HeadingInfo = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-[16px] w-3/4 font-normal leading-7">{description}</p>
    </div>
  );
};
