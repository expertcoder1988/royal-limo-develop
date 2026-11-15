"use client";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
const LinkButtonForBookingVehicle = ({
  vehicle,
  label,
  className,
}: {
  vehicle: string;
  label?: string;
  className?: string;
}) => {
  const vehicleLowerCase = vehicle.toLowerCase().replace(" ", "_");

  return (
    <Link
      href={`${routes.bookNow}#${vehicleLowerCase}`}
      className={"w-full flex flex-row"}
    >
      <Button
        size="lg"
        className={cn("w-full bg-primary hover:bg-black", className)}
        onClick={() => {
          localStorage.setItem(
            "bookingDetails",
            JSON.stringify({
              vehicle: vehicleLowerCase,
              activeStep: 1,
            })
          );
        }}
      >
        {label || `Book Your ${vehicle} Now`}
      </Button>
    </Link>
  );
};

export default LinkButtonForBookingVehicle;
