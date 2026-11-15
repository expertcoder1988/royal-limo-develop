import { IconArmchair, IconBriefcase } from "@tabler/icons-react";
import { Check } from "lucide-react";

const VehicleBookingCard = ({
  vehicle,
  form,
}: {
  vehicle: {
    value: string;
    name: string;
    model: string;
    description: string;
    lougageCapacity: string;
    passengerCapacity: string;
    wifi: boolean;
    charging: boolean;
    massage: boolean;
    image: string;
  };
  form: any;
}) => {
  return (
    <div
      className={`shadow-md rounded-xl h-96 p-4 w-[280px] my-2 flex flex-col justify-between gap-3 cursor-pointer ${
        form.watch("vehicle") === vehicle?.value
          ? "bg-gradient-to-b from-tertiary to-primary text-primary-foreground"
          : "bg-white text-secondary"
      }`}
      onClick={() => form.setValue("vehicle", vehicle?.value)}
    >
      <div>
        <div className="flex justify-end">
          {form.watch("vehicle") !== vehicle?.value ? (
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          ) : (
            <div className="w-12 h-12 bg-white rounded-full flex justify-center items-center">
              <Check size={24} color="black" />
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <img 
            src={vehicle?.image}
            alt={vehicle?.name}
            title={vehicle?.name}
            className="w-52 h-32 object-contain"
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xl font-medium">{vehicle?.name}</p>
        </div>
      </div>
      <p className="text-sm font-normal line-clamp-3">{vehicle?.description}</p>
      <div className="space-y-3">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2">
            <IconBriefcase size={24} color="#000" />
            <p className="text-sm font-normal">
              <span className="font-normal text-sm">
                <span className="text-lg text-gray-500">
                  {vehicle?.lougageCapacity}
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
                  {vehicle?.passengerCapacity}
                </span>{" "}
                Passenger
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleBookingCard;
