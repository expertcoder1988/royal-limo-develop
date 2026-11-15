"use client";
import React from "react";
import CustomPagination from "@/components/common/CustomPagination";
import Loader from "@/components/common/Loader";
import MyBookingCard from "@/components/common/MyBookingCard";
import { APIHeaders, AdminHeaders, backendURL } from "@/constants/bankendURL";
import { routes } from "@/constants/routes";
import { IconPlus } from "@tabler/icons-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const MyBookingsPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPage = parseInt(searchParams?.get("page") || "0");
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [isAdmin, setIsAdmin] = useState<null | boolean>(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const isAdmin = Boolean(localStorage.getItem("admin"));
    setIsAdmin(isAdmin);
  }, []);
  useEffect(() => {
    setCurrentPage(urlPage);
  }, [urlPage]);
  const pageSize = isAdmin ? 12 : 11;
  const url = isAdmin ? "/booking" : "/booking/my-bookings";
  const fetchUsers = (currentPage: number) =>
    axios
      .get(
        backendURL +
          url +
          "?page=" +
          (currentPage + 1) +
          "&pageSize=" +
          pageSize +
          "&sortBy=date" +
          "&sortOrder=desc",
        {
          headers: isAdmin ? AdminHeaders() : APIHeaders(),
        }
      )
      .then((res) => res.data)
      .catch((err) => err);
  const { isFetching, data, isFetched, isError, isPlaceholderData } = useQuery({
    queryKey: ["users", currentPage],
    queryFn: () => fetchUsers(currentPage),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: isClient,
  });
  const totalPages = data?.totalPages - 1;
  if (isFetched && isClient) {
    if (data?.response?.status === 401) {
      toast.message("Please Login First");
      router.replace(isAdmin ? "/login-admin" : "/login" + "?from=" + pathname);
    }
  }
  if (isError) {
    toast.error("An Error Occured, Please Try Again Later");
  }

  const bookings = data?.data || [];
  return (
    <div className="p-8 container">
      <Loader isLoading={isFetching} />
      <div>
        <h1 className="text-3xl mb-4 font-semibold">
          {isAdmin ? "All Bookings" : "My Bookings"}
        </h1>
        <div className="flex flex-wrap justify-center gap-4">
          {!isAdmin && (
            <div
              className="flex flex-col p-8 h-96 w-72 shadow-xl items-center justify-center gap-8 cursor-pointer hover:bg-tertiary transition duration-500 ease-in-out"
              onClick={() => {
                router.push("/book");
              }}
            >
              <p className="text-3xl font-semibold text-primary">Add Booking</p>
              <div className="p-8 bg-primary rounded-full">
                <IconPlus size={40} color="white" />
              </div>
            </div>
          )}
          {bookings.length === 0 ? (
            <h1 className="text-xl font-medium">
              {isPlaceholderData ? "Loading..." : isAdmin && "No Bookings Yet"}
            </h1>
          ) : (
            <div>
              <div className="flex flex-wrap justify-center gap-4">
                {bookings.map((booking: any, index: number) => (
                  <MyBookingCard
                    key={index}
                    bookingDetails={booking}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
              <CustomPagination
                className={" container flex justify-end m-4"}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page: number) => {
                  setCurrentPage(page);
                  if (isAdmin) {
                    router.push(routes.myBookings + "?page=" + page);
                    window.scrollTo(0, 0);
                  } else {
                    router.push(routes.myBookings + "?page=" + page);
                    window.scrollTo(0, 0);
                  }
                }}
                isPlaceholderData={isPlaceholderData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
