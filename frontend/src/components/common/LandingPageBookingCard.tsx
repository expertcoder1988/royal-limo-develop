import CarLogo from "@/assets/CarLogo";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkValidations } from "@/constants/formValidation";
import { routes } from "@/constants/routes";
import { carTypes } from "@/constants/staticInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormDateTime from "./FormDateTime";
import FormGoogleMapAutoComplete from "./GoogleMapAutoComplete";

const FormSchema = z
  .object({
    bookingType: z.string().optional(),
    vehicle: z.string().optional(),
    pickupPoint: z.string().optional(),
    dropoffPoint: z.string().optional(),
    pickupTime: z.string().optional(),
    dropoffTime: z.string().optional(),
  })
  .refine((data) => {
    checkValidations(data);
    return true;
  });

const LandingPageBookingCard = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      bookingType: "time_based",
      vehicle: carTypes?.[0]?.value,
    },
  });
  useEffect(() => {
    const locationMayo = "Mayo Clinic, 1216 2nd St SW, Rochester, MN 55902";
    const locationAirport =
      "MSP Terminal 1 Concourse A-Lindbergh, 4300 Glumack Dr, St Paul, MN 55111";

    if (form.watch("bookingType") === "to") {
      form.setValue("pickupPoint", locationMayo);
      form.setValue("dropoffPoint", locationAirport);
      // ensures that Booking Type "To" is not affected by garbage values in pickuptime field
      form.setValue("pickupTime", "");
      form.clearErrors("pickupTime");
    } else if (form.watch("bookingType") === "from") {
      form.setValue("pickupPoint", locationAirport);
      form.setValue("dropoffPoint", locationMayo);
    }
  }, [form.watch("bookingType"), form.getValues().bookingType]);

  // const [bookingType, setSelectedTab] = useState("time_based");
  return (
    <div className="min-w-[1024px] xl:min-w-[1330px]">
      <Tabs
        defaultValue={form.watch("bookingType") || "time_based"}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="time_based"
            className="rounded-tl-lg"
            onClick={() => form.setValue("bookingType", "time_based")}
          >
            Time Based
          </TabsTrigger>
          <TabsTrigger
            value="point"
            onClick={() => form.setValue("bookingType", "point")}
          >
            Point to Point
          </TabsTrigger>
          {/* <TabsTrigger
            value="multiple"
            onClick={() => form.setValue("bookingType", "multiple")}
          >
            Multiple Days
          </TabsTrigger> */}
          <TabsTrigger
            value="to"
            onClick={() => form.setValue("bookingType", "to")}
          >
            To Airport
          </TabsTrigger>
          <TabsTrigger
            value="from"
            className="rounded-tr-lg"
            onClick={() => form.setValue("bookingType", "from")}
          >
            From Airport
          </TabsTrigger>
        </TabsList>
        <div>
          {
            <div className="flex items-center gap-6 p-4">
              {carTypes.map((carType, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center hover:bg-gray-100 px-3 py-1 rounded-lg cursor-pointer ${
                    form.watch("vehicle") === carType.value &&
                    "border-2 border-primary"
                  }`}
                  onClick={() => form.setValue("vehicle", carType.value)}
                >
                  <CarLogo car={carType.car.src} />
                  <p
                    className={`text-[14px] ${
                      form.watch("vehicle") === carType.value && "text-primary"
                    }`}
                  >
                    {carType.label}
                  </p>
                </div>
              ))}
            </div>
          }
        </div>
        <TabsContent value={form.watch("bookingType") || "time_based"}>
          <BookingForm form={form} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LandingPageBookingCard;

const BookingForm = ({ form }: any) => {
  const router = useRouter();
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const bookingData = {
      ...data,
      isFromLandingPage: true,
    };
    localStorage.setItem("bookingDetails", JSON.stringify(bookingData));
    router.push(routes.bookNow);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-center gap-3 px-4">
            {form.watch("bookingType") !== "multiple" &&
              form.watch("bookingType") !== "time_based" && (
                <FormGoogleMapAutoComplete
                  airportOnly={Boolean(form.watch("bookingType") === "from")}
                  form={form}
                  name="pickupPoint"
                  label="Pick up Location"
                  placeHolder="Enter Pick up Location"
                  className="w-[250px]"
                />
              )}
            {form.watch("bookingType") !== "time_based" &&
              form.watch("bookingType") !== "multiple" && (
                <FormGoogleMapAutoComplete
                  airportOnly={Boolean(form.watch("bookingType") === "to")}
                  form={form}
                  name="dropoffPoint"
                  label="Drop off Location"
                  placeHolder="Enter Drop off Location"
                  className="w-[250px]"
                />
              )}
            {form.watch("bookingType") !== "to" && (
              <FormDateTime
                form={form}
                name="pickupTime"
                label="Pick up Time"
                placeHolder="Enter Pick up Time"
                min={moment().add(60, "minutes").format().slice(0, 16)}
                max={moment().add(1, "years").format().slice(0, 16)}
                onChange={(e: string) => {
                  const pickupString = e.replace("T", " ");
                  const dropoffString = form
                    .getValues()
                    .dropoffTime?.replace("T", " ");

                  const selectedDate = moment(pickupString);
                  const min = moment().add(60, "minutes");
                  const max = moment().add(1, "years");

                  if (selectedDate.isBefore(min)) {
                    // create error for field
                    form.setError("pickupTime", {
                      type: "custom",
                      message: `Must be greater than ${min.format(
                        "DD/MM/yy hh:mmA"
                      )}`,
                    });
                  } else if (selectedDate.isAfter(max)) {
                    form.setError("pickupTime", {
                      type: "custom",
                      message: `Must be less than ${max.format("DD/MM/yy")}`,
                    });
                  } else {
                    form.clearErrors("pickupTime");
                  }
                  if (dropoffString) {
                    const dropOffDate = moment(dropoffString);
                    if (selectedDate.isAfter(dropOffDate)) {
                      form.setError("dropoffTime", {
                        type: "custom",
                        message: `Must be greater than pickup time`,
                      });
                    } else if (
                      dropOffDate.isAfter(moment(selectedDate).add(25, "hours"))
                    ) {
                      form.setError("dropoffTime", {
                        type: "custom",
                        message: `Must be within 24 hours from pickup`,
                      });
                    } else {
                      form.clearErrors("dropoffTime");
                    }
                  }
                }}
              />
            )}

            {form.watch("bookingType") !== "point" &&
              form.watch("bookingType") !== "from" && (
                <div className="flex">
                  <FormDateTime
                    form={form}
                    name="dropoffTime"
                    label="Drop off Time"
                    placeHolder="Enter Drop off Time"
                    min={
                      (form.watch("pickupTime") &&
                        moment(form.watch("pickupTime"))
                          .add(30, "minutes")
                          .format()
                          .slice(0, 16)) ||
                      moment().add(60, "minutes").format().slice(0, 16)
                    }
                    max={
                      (form.watch("bookingType") !== "multiple" &&
                        form.watch("pickupTime") &&
                        moment(form.watch("pickupTime"))
                          .add(25, "hours")
                          .format()
                          .slice(0, 16)) ||
                      moment().add(1, "years").format().slice(0, 16)
                    }
                    onChange={(e: string) => {
                      const pickupString = form
                        .getValues()
                        .pickupTime?.replace("T", " ");
                      const dropoffString = e.replace("T", " ");

                      const selectedDate = moment(dropoffString);
                      const min = moment(pickupString).add(30, "minutes");
                      const max = moment(pickupString).add(25, "hours");

                      if (selectedDate.isBefore(min)) {
                        // create error for field
                        form.setError("dropoffTime", {
                          type: "custom",
                          message: `Must be greater than ${min.format(
                            "DD/MM/yy hh:mmA"
                          )}`,
                        });
                      } else if (selectedDate.isAfter(max)) {
                        form.setError("dropoffTime", {
                          type: "custom",
                          message: `Must be less than ${max.format(
                            "DD/MM/yy hh:mmA"
                          )}`,
                        });
                      } else {
                        form.clearErrors("dropoffTime");
                      }
                    }}
                  />
                </div>
              )}
            <Button type="submit" className="mt-[32px]">
              Book Now
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
