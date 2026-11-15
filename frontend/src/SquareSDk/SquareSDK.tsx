import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { toast } from "sonner";

export default function SquareSDK({
  bookingMutation,
  form,
}: {
  bookingMutation: any;
  form: any;
}) {
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    if (form.watch("saveCardDetails") === false) {
      form.setValue("cardholderName", "");
      setIsError(false);
    }
  }, [form.watch("saveCardDetails")]);
  useEffect(() => {
    if (form.watch("saveCardDetails") === true) {
      if (form.watch("cardholderName") !== "") {
        setIsError(false);
      } else {
        setIsError(true);
        toast.error("Card Holder Name is required");
      }
    }
  }, [form.watch("cardholderName")]);
  return (
    <div className="bg-tertiary w-full rounded-2xl p-8 mt-8 text-secondary">
      <div
        // style={{
        //   display: "grid",
        //   justifyContent: "center",
        //   alignContent: "center",
        //   width: "100%",
        // }}
        className="flex justify-center items-center gap-2"
      >
        <PaymentForm
          applicationId={process.env.NEXT_PUBLIC_SQUARE_SDK_APPLICATION_ID}
          cardTokenizeResponseReceived={(token: any) => {
            if (
              form.watch("saveCardDetails") === true &&
              form.getValues().cardholderName === ""
            ) {
              setIsError(true);
              toast.error("Card Holder Name is required");
            } else {
              bookingMutation(token?.token);
            }
          }}
          locationId={process.env.NEXT_PUBLIC_SQUARE_SDK_LOCATION_ID}
        >
          <CreditCard />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              value={form.watch("saveCardDetails")}
              onChange={(e) =>
                form.setValue("saveCardDetails", e.target.checked)
              }
              className="h-5 w-5 rounded-lg"
            />
            <p>Save Card Details</p>
          </div>
        </PaymentForm>
      </div>
      {form.watch("saveCardDetails") === true && (
        // <Form {...form}>
        //   <form className="container rounded-2xl mt-2 w-[370px]">
        //     <FormInput
        //       form={form}
        //       name="cardholderName"
        //       label="Card Holder Name"
        //       placeHolder="Enter Card Holder Name"
        //       labelClassName="font-semibold mb-4"
        //       // className="max-md:w-full space-y-0.5 mb-1 bg-transparent"
        //     />
        //   </form>
        // </Form>
        <div className="flex flex-col items-center justify-center">
          <input
            type="text"
            value={form.watch("cardholderName")}
            onChange={(e) => form.setValue("cardholderName", e.target.value)}
            className={`rounded-md mt-2 p-2 w-[300px] ${isError && "border-2 border-red-500"
              }`}
            placeholder="Card Holder Name"
          />
        </div>
      )}
    </div>
  );
}
