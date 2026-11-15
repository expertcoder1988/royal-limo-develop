// const GoogleMapAutoComplete = ({ form, label, placeHolder, className }) => {

//   return (
//     isLoaded && (
//       <Autocomplete
//         types={["geocode"]}
//         onLoad={onLoad}
//         onPlaceChanged={onPlaceChanged}
//       >
//         <input
//           value={formatted_address}
//           onChange={(val) => setFormatted_address(val.target.value)}
//           placeholder="Search for a location"
//           className="w-full p-2 border-[1px] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </Autocomplete>
//     )
//   );
// };

"use client";
// export default GoogleMapAutoComplete;
import { MAPS_API_KEY } from "@/constants/envConstants";
import { cn } from "@/lib/utils";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useId, useState } from "react";
import { toast } from "sonner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const FormGoogleMapAutoComplete = ({
  form,
  name,
  className,
  labelClassName,
  placeHolder,
  label,
  disabled,
  airportOnly = false,
}: {
  form: any;
  name: string;
  className?: string;
  labelClassName?: string;
  placeHolder?: string;
  label: string;
  disabled?: boolean;
  airportOnly?: boolean;
}) => {
  const id = useId();
  // const [center, setCenter] = useState<{
  //   lat: number | undefined;
  //   lng: number | undefined;
  // }>({ lat: undefined, lng: undefined });
  // console.log("center", center);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: MAPS_API_KEY as string,
    libraries: ["places", "geometry", "drawing"],
  });

  // Use the Geolocation API to get the user's location by default

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       setCenter({
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       });
  //     });
  //   }
  // }, []);

  const onPlaceChanged = () => {
    if (selectedPlace != null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const place = selectedPlace?.getPlace();
      if (airportOnly) {
        if (
          (place.types &&
            place.types.includes("premise") &&
            (place.formatted_address?.toLowerCase()?.includes("airport") ||
              place.formatted_address?.toLowerCase()?.includes("terminal"))) ||
          place.types.includes("airport")
        ) {
          const formatted_address = place.formatted_address;
          form.setValue(name, formatted_address);
        } else {
          form.setValue(name, "");
          toast.error("Please select an airport or terminal");
        }
      } else {
        form.setValue(name, place.formatted_address);
      }
      // setFormatted_address(formatted_address);
      // setCenter({
      //   lat: place.geometry?.location.lat(),
      //   lng: place.geometry?.location.lng(),
      // });
    } else {
      toast.error("Loading... Please wait!");
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const onLoad = useCallback((autocomplete) => {
    setSelectedPlace(autocomplete);
  }, []);
  const options = {
    componentRestrictions: { country: "us" },
    // fields: ["address_components", "geometry", "icon", "name"],
    strictBounds: true,
  };
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel htmlFor={id} className={labelClassName || "font-semibold"}>
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {isLoaded && (
                <Autocomplete
                  types={["geocode"]}
                  onLoad={onLoad}
                  onPlaceChanged={onPlaceChanged}
                  options={options}
                >
                  <input
                    // value={formatted_address}
                    value={form.getValues(name)}
                    disabled={disabled}
                    onChange={(val) => {
                      form.setValue(name, val.target.value);
                      // setFormatted_address(val.target.value);
                    }}
                    placeholder={placeHolder}
                    className={cn(
                      "flex h-[38px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-black placeholder:text-xs focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50",
                      className
                    )}
                  />
                </Autocomplete>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormGoogleMapAutoComplete;
