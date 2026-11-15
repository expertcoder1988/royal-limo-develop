import FleetHero from "@/components/common/FleetHero";
import FleetsCard from "@/components/common/FleetsCard";
import LinkButtonForBookingVehicle from "@/components/common/LinkButtonForBookingVehicle";
import { cadillacEscaldate } from "@/constants/seoContent";
import React from "react";
const Car1 = () => {
  return (
    <div className="flex flex-col">
      {cadillacEscaldate.map((item: any, index: any) => (
        <div key={index}>
          <FleetHero
            data={{
              title: item.fleetTitle,
              description: item.fleetDescription,
              color: item.fleetColor,
              capacity: item.fleetCapacity,
              image: item.fleetImage,
            }}
          />
          <div className="container mx-auto px-4 flex flex-col items-center">
            <FleetsCard data={item} />
          </div>
          <div className="flex pt-20 px-10 justify-center items-center">
            <LinkButtonForBookingVehicle
              vehicle={item.fleetTitle}
              className="bg-black hover:bg-primary md:w-[50%] lg:w-[30%] mx-auto  self-center"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Car1;
