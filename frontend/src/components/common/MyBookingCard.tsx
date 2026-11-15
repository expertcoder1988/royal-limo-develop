import { vehicleNameImage } from "@/constants/staticInfo";
import { IconLocation } from "@tabler/icons-react";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";

const MyBookingCard = ({
  bookingDetails,
  isAdmin,
}: {
  bookingDetails: any;
  isAdmin?: boolean | null;
}) => {
  const router = useRouter();

  return (
    <div className="p-4 w-72 h-96 flex flex-col gap-2 items-center justify-between shadow-lg rounded-xl">
      <div className="flex flex-col gap-2 items-center w-full">
        <div className="flex justify-end w-full p-2">
          <p
            className={`rounded-md px-2 text-[12px] flex uppercase  ${
              bookingDetails.status === "active"
                ? "bg-yellow-500 text-white"
                : bookingDetails.status === "completed"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {bookingDetails?.status}
          </p>
        </div>

        <img 
          src={vehicleNameImage(bookingDetails?.vehicle)?.image as string}
          alt="car"
          title="car"
          className="object-contain h-14"
          style={{
            transform: "scaleX(-1)",
          }}
        />

        <p className="font-medium text-[20px]">
          {vehicleNameImage(bookingDetails?.vehicle)?.name}
        </p>
        <p className="font-normal text-[12px]">{bookingDetails?.type}</p>

        <Separator />
        <div className="flex gap-4 items-center">
          {bookingDetails?.pickupTime && (
            <div>
              <p className="font-medium text-[12px]">
                {new Date(bookingDetails?.pickupTime).toDateString()}
              </p>
              <p className="font-medium text-[12px]">
                {new Date(bookingDetails?.pickupTime).toLocaleTimeString()}
              </p>
            </div>
          )}
          {bookingDetails?.pickupDate && (
            <div>
              <p className="font-medium text-[12px]">
                {new Date(bookingDetails?.pickupDate).toDateString()}
              </p>
              <p className="font-medium text-[12px]">
                {new Date(bookingDetails?.pickupDate).toLocaleTimeString()}
              </p>
            </div>
          )}
          {bookingDetails?.dropoffTime && <ArrowRight size={16} />}
          {bookingDetails?.dropoffDate && <ArrowRight size={16} />}
          {bookingDetails?.dropoffTime && (
            <div>
              <p className="font-medium text-[12px]">
                {new Date(bookingDetails?.dropoffTime).toDateString()}
              </p>
              <p className="font-medium text-[12px]">
                {new Date(bookingDetails?.dropoffTime).toLocaleTimeString()}
              </p>
            </div>
          )}
          {bookingDetails?.dropoffDate && (
            <div>
              <p className="font-medium text-[12px]">
                {new Date(bookingDetails?.dropoffDate).toDateString()}
              </p>
              <p className="font-medium text-[12px]">
                {new Date(bookingDetails?.dropoffDate).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
        {(bookingDetails?.dropoffDate || bookingDetails?.pickupTime) && (
          <Separator />
        )}
        {bookingDetails?.dropoffTime &&
          bookingDetails?.pickupTime &&
          bookingDetails?.type !== "Time Based" && <Separator />}
      </div>

      {bookingDetails?.pickupPoint && (
        <div className="flex gap-2 ">
          <IconLocation size={16} />
          <p className="font-medium text-[12px]  line-clamp-1">
            {bookingDetails?.pickupPoint}
          </p>
        </div>
      )}
      {bookingDetails?.dropoffPoint && <Separator />}

      {bookingDetails?.dropoffPoint && (
        <div className="flex gap-2 ">
          <IconLocation size={16} />
          <p className="font-medium text-[12px] line-clamp-1">
            {bookingDetails?.dropoffPoint}
          </p>
        </div>
      )}
      <Button
        size="default"
        variant="default"
        className="w-full rounded-t-none flex items-center justify-center gap-2 bg-gradient-to-b from-tertiary to-primary"
        onClick={() => {
          isAdmin
            ? router.push(
                routes.admin.adminViewBookingDetails.replace(
                  ":id",
                  bookingDetails?._id
                )
              )
            : router.push(
                routes.viewBooking.replace(":id", bookingDetails?._id)
              );
        }}
      >
        View Details
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default MyBookingCard;
