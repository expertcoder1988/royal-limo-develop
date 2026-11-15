import { IconArmchair, IconBriefcase } from "@tabler/icons-react";
import { Separator } from "../ui/separator";
import LinkButtonForBookingVehicle from "./LinkButtonForBookingVehicle";

const VehicleCard = ({
  vehicle,
}: {
  vehicle: {
    value: string;
    name: string;
    model: string;
    description: string;
    lougageCapacity: string;
    passengerCapacity: string;
    image: string;
  };
}) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-[320px] my-2 flex flex-col justify-between gap-3">
      <div>
        <img 
          src={vehicle.image}
          alt={vehicle.name}
          title={vehicle.name}
          className="w-96 h-48 object-contain rounded-xl"
        />
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-medium">{vehicle.name}</h3>
          <p className="text-sm font-normal underline">{vehicle.model}</p>
        </div>
      </div>
      <p className="text-sm font-normal">{vehicle.description}</p>
      <div className="space-y-3">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2">
            <IconBriefcase size={24} color="#000" />
            <p className="text-sm font-normal">
              <span className="font-normal text-sm">
                <span className="text-lg text-gray-500">
                  {vehicle.lougageCapacity}
                </span>{" "}
                Lougage
              </span>
            </p>
          </div>
          <div className="w-0.5 h-4 bg-primary"></div>
          <div className="flex gap-2">
            <IconArmchair size={24} color="#000" />
            <p className="text-sm font-normal">
              <span className="font-normal text-sm">
                <span className="text-lg text-gray-500">
                  {vehicle.passengerCapacity}
                </span>{" "}
                Passenger
              </span>
            </p>
          </div>
        </div>
        <Separator />
        <LinkButtonForBookingVehicle vehicle={vehicle.name} />
      </div>
    </div>
  );
};

export default VehicleCard;
