"use client";
import React from "react";
import Loader from "@/components/common/Loader";
import { PayAlert } from "@/components/common/PayAlert";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/ui/button";
import { APIHeaders, AdminHeaders, backendURL } from "@/constants/bankendURL";
import { routes } from "@/constants/routes";
import { vehicleNameImage } from "@/constants/staticInfo";
import { IconLocation, IconLocationOff } from "@tabler/icons-react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BookingDetails = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState<null | boolean>(null);

  useEffect(() => {
    setIsClient(true);
    const isAdmin = Boolean(localStorage.getItem("admin"));
    setIsAdmin(isAdmin);
  }, []);

  if (!id && isClient) {
    toast.error("Invalid URL. Please try again.");
    router.replace(routes.admin.allBookings);
  }

  const fetchBookingDetails = () =>
    axios
      .get(backendURL + "/booking/" + id, {
        headers: isAdmin ? AdminHeaders() : APIHeaders(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  const { isFetching, data, isError } = useQuery({
    queryKey: ["bookingDetails", id],
    queryFn: () => fetchBookingDetails(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: Boolean(isClient),
  });
  if (isError) {
    toast.error("An Error Occured, Please Try Again Later");
  }
  const bookingDetails = data || {};
  const onSubmitCancel = () => {
    const resData = axios.put(
      `${backendURL}/booking/cancel/${id}`,
      {},
      {
        headers: isAdmin ? AdminHeaders() : APIHeaders(),
      }
    );
    return resData;
  };
  const { mutateAsync: bookingMutation } = useMutation({
    mutationFn: onSubmitCancel,
    onSuccess: () => {
      localStorage.removeItem("bookingDetails");
      toast.success("Vehicle cancelled Successfully", {
        description: "Your booking has been cancelled successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["bookingDetails"] });
    },
    onError: (error: { response: { data: { errors: string } } }) => {
      toast.error("An Error Occured!", {
        description: error?.response?.data?.errors,
      });
    },
  });
  const onSubmitComplete = () => {
    const resData = axios.put(
      `${backendURL}/admin/booking/complete/${id}`,
      {},
      {
        headers: AdminHeaders(),
      }
    );
    return resData;
  };
  const { mutateAsync: completeMutation } = useMutation({
    mutationFn: onSubmitComplete,
    onSuccess: () => {
      localStorage.removeItem("bookingDetails");
      toast.success("Vehicle Booked Successfully", {
        description: "Your vehicle has been booked successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["bookingDetails"] });
    },
    onError: (error: { response: { data: { errors: string } } }) => {
      toast.error("An Error Occured!", {
        description: error?.response?.data?.errors,
      });
    },
  });

  const [openAlert, setOpenAlert] = useState(false);
  const [openAlert2, setOpenAlert2] = useState(false);
  const [payAlert, setPayAlert] = useState(false);
  return (
    <div className="text-secondary p-16 rounded-2xl flex flex-col gap-8">
      <Alert
        open={openAlert}
        setOpen={setOpenAlert}
        title={"Cancel Booking"}
        description={"Are you sure you want to cancel this booking?"}
        buttonTitle={"Yes, Cancel"}
        onClick={() => {
          bookingMutation(bookingDetails?._id);
          setOpenAlert(false);
        }}
      />
      <Alert
        open={openAlert2}
        setOpen={setOpenAlert2}
        title={"Complete Booking"}
        description={"Are you sure you want to complete this booking?"}
        buttonTitle={"Yes, Complete"}
        onClick={() => {
          completeMutation(bookingDetails?._id);
          setOpenAlert(false);
        }}
      />
      <PayAlert
        open={payAlert}
        setOpen={setPayAlert}
        title={"Pay Now"}
        description={"Are you sure you want to pay now?"}
        buttonTitle={"Yes, Pay Now"}
        bookingId={bookingDetails?._id}
      />

      <Loader isLoading={isFetching} />
      <div className="lg:flex justify-between items-center max-md:space-y-2">
        <h1 className="font-semibold text-3xl">
          <span className="text-primary">Booking</span> Details
        </h1>
        <div className="md:flex md:pt-2 lg:pt-0 items-center gap-4 max-md:space-y-2">
          {bookingDetails?.status === "active" &&
            bookingDetails?.paymentStatus === "partially_paid" &&
            isAdmin && (
              <div className="lg:flex justify-end gap-4">
                <Button
                  variant={"gradient"}
                  onClick={() => {
                    setPayAlert(true);
                  }}
                >
                  Pay Now
                </Button>
              </div>
            )}
          {bookingDetails?.status === "active" && (
            <div className="lg:flex justify-end gap-4">
              <Button
                variant={"destructive"}
                onClick={() => {
                  setOpenAlert(true);
                }}
              >
                Cancel Booking
              </Button>
            </div>
          )}
          {bookingDetails?.status === "active" && isAdmin && (
            <Button
              onClick={() => {
                setOpenAlert2(true);
              }}
              className="bg-green-700"
            >
              Mark as Completed
            </Button>
          )}
        </div>
      </div>

      <div className="p-8 rounded-xl bg-gradient-to-b from-[#FDD474]/[0.15] to-[#BA8209]/[0.15] border-primary border-[1px]">
        <div className="lg:flex w-full items-center gap-4 max-md:space-y-2">
          <img 
            src={vehicleNameImage(bookingDetails.vehicle)?.image as string}
            alt="Vehicle"
            title="Vehicle"
            className="w-40"
            style={{ transform: "scaleX(-1)" }}
          />
          <div className="w-full flex flex-col gap-4">
            <div className="lg:flex items-center justify-between w-full max-md:space-y-2">
              <div className="lg:flex items-center gap-4">
                <p className="font-semibold text-xl flex items-center justify-center text-center text-primary uppercase">
                  {vehicleNameImage(bookingDetails.vehicle)?.name}
                </p>
                <p
                  className={`font-medium text-[14px] bg-secondary rounded-xl px-4 uppercase text-center
                  ${
                    bookingDetails.status === "active"
                      ? "bg-yellow-500 text-white"
                      : bookingDetails.status === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }
                  
                  `}
                >
                  {bookingDetails.status}
                </p>
              </div>
              <div className="lg:flex items-center gap-4">
                <p className="font-semibold text-lg">Booking ID:</p>{" "}
                <p className="uppercase">
                  s{bookingDetails?._id?.slice(0, 6)?.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="lg:flex items-center justify-between w-full max-md:space-y-2">
              <p className="font-medium text-[16px] text-secondary">
                {bookingDetails.type}
              </p>

              <div className="lg:flex items-center gap-4 max-md:space-y-2">
                <p className="font-semibold text-lg">Payment Status:</p>{" "}
                <p
                  className={`uppercase font-bold ${
                    bookingDetails.paymentStatus === "partially_paid"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {bookingDetails.paymentStatus === "partially_paid"
                    ? "Partially Paid"
                    : "Fully Paid"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-8 rounded-xl bg-gradient-to-b from-[#FDD474]/[0.15] to-[#BA8209]/[0.15] border-primary border-[1px]">
        <div className="flex max-lg:flex-col justify-between">
          <div className="lg:w-1/2 space-y-4 ">
            {bookingDetails?.pickupPoint && (
              <div className="flex flex-col gap-2">
                <p className="font-medium text-md">Pickup Location:</p>{" "}
                <div className="flex items-center gap-2">
                  <IconLocation size={16} />
                  <p className="uppercase">{bookingDetails.pickupPoint}</p>
                </div>
              </div>
            )}
            {bookingDetails?.dropoffPoint && (
              <div className="flex flex-col gap-2">
                <p className="font-medium text-md">Drop off Location:</p>{" "}
                <div className="flex items-center gap-2">
                  <IconLocationOff size={16} />
                  <p className="uppercase">{bookingDetails.dropoffPoint}</p>
                </div>
              </div>
            )}
            {bookingDetails?.pickupTime && (
              <div className="flex flex-col gap-2">
                <p className="font-medium text-md">Pick up Date and Time:</p>{" "}
                <p className="uppercase">
                  {new Date(bookingDetails.pickupTime).toDateString()} at{" "}
                  {new Date(bookingDetails.pickupTime).toLocaleTimeString()}
                </p>
              </div>
            )}
            {bookingDetails?.dropoffTime && (
              <div className="flex flex-col gap-2">
                <p className="font-medium text-md">Drop off Date and Time:</p>{" "}
                <p className="uppercase">
                  {new Date(bookingDetails.dropoffTime).toDateString()} at{" "}
                  {new Date(bookingDetails.dropoffTime).toLocaleTimeString()}
                </p>
              </div>
            )}
            {bookingDetails?.pickupDate && (
              <div className="flex flex-col gap-2">
                <p className="font-medium text-md">Pick up Date:</p>{" "}
                <p className="uppercase">
                  {new Date(bookingDetails.pickupDate).toDateString()}
                </p>
              </div>
            )}
            {bookingDetails?.dropoffDate && (
              <div className="flex flex-col gap-2">
                <p className="font-medium text-md">Drop off Date:</p>{" "}
                <p className="uppercase">
                  {new Date(bookingDetails.dropoffDate).toDateString()}
                </p>
              </div>
            )}
          </div>
          <div className="lg:w-1/2">
            <div className="space-y-2">
              <p className="font-medium text-[18px] mb-2">Charges</p>
              <div className="flex justify-between items-center">
                <p className="flex items-center gap-2">
                  <span className="font-medium">
                    Luggage x {bookingDetails?.luggage}:
                  </span>
                </p>
                <div className="border-[1px] border-dashed w-80"></div>
                <p>
                  ${""}
                  {bookingDetails?.passengers * 0}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="flex items-center gap-2">
                  <span className="font-medium">
                    Passengers x {bookingDetails?.passengers}:
                  </span>
                </p>
                <div className="border-[1px] border-dashed w-80"></div>
                <p>
                  ${""}
                  {bookingDetails?.passengers * 0}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="flex items-center gap-2">
                  <span className="font-medium">
                    Child Seats x {bookingDetails?.babySeats}:
                  </span>
                </p>
                <div className="border-[1px] border-dashed w-80"></div>
                <p>
                  ${""}
                  {bookingDetails?.babySeats * 20}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Total Fare:</span>
                </p>
                <div className="border-[1px] border-dashed w-80"></div>
                <p>
                  ${""}
                  {bookingDetails?.fare}
                </p>
              </div>
            </div>
            <div className="border-[2px] mt-8"></div>
            <div className="flex justify-between items-center">
              <p className="font-medium text-[20px]">Total Quote</p>
              <p className="font-medium text-[20px]">
                {" "}
                ${""}
                {bookingDetails?.fare}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-8 rounded-xl bg-gradient-to-b from-[#FDD474]/[0.15] to-[#BA8209]/[0.15] flex flex-col gap-4 border-primary border-[1px]">
        <h1 className="text-xl font-medium">Contact Details</h1>
        <div className="lg:flex items-center justify-between max-lg:space-y-3">
          <div>
            <p className="font-medium">First Name</p>
            <p>{bookingDetails?.firstname}</p>
          </div>
          <div>
            <p className="font-medium">Last Name</p>
            <p>{bookingDetails?.lastname}</p>
          </div>
          <div>
            <p className="font-medium">Phone No.</p>
            <p>{bookingDetails?.phoneNo}</p>
          </div>
          <div>
            <p className="font-medium">Email Address</p>
            <p>{bookingDetails?.email}</p>
          </div>
        </div>
        {bookingDetails?.notes && (
          <div>
            <p className="font-medium">Additional Notes</p>
            <p>{bookingDetails?.notes}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant={"default"}
          className="w-24"
          onClick={() => {
            router.replace(
              isAdmin ? routes.admin.allBookings : routes.myBookings
            );
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default BookingDetails;
