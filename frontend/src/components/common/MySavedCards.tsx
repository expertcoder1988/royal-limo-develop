import { backendURL } from "@/constants/bankendURL";
import { IconBrandMastercard, IconBrandVisa } from "@tabler/icons-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Loader from "./Loader";

const MySavedCards = ({
  setCardId,
  setUseSavedCard,
  cardId,
  isAdmin,
  bookingId,
  setFetchingCards,
}: {
  setCardId: any;
  setUseSavedCard?: any;
  cardId: any;
  isAdmin?: boolean;
  bookingId?: string;
  setFetchingCards?: any;
}) => {
  const url = isAdmin ? `/pay/user-cards/${bookingId}` : "/pay";
  const router = useRouter();
  const pathname = usePathname();
  let cardDetails = [] as any;

  const fetchBookingDetails = () =>
    axios
      .get(backendURL + url, {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem(isAdmin ? "adminToken" : "authToken"),
        },
      })
      .then((res) => res.data)
      .then((data) => {
        cardDetails = data && data;
        return data;
      })
      .catch((err) => {
        if ([500].includes(err?.response?.status as number)) {
          cardDetails = [];
          toast.info("No Saved Card Info Found At The Moment");
        } else if ([400, 404].includes(err?.response?.status as number)) {
          cardDetails = [];
          toast.error("No Cards Fetched");
        } else if ([401].includes(err?.response?.status as number)) {
          cardDetails = [];
          toast.error("Please Login First");
          router.push(`/login?from=${pathname}`);
          localStorage.removeItem("authToken");
        }

        return err;
      })
      .finally(() => {
        isAdmin && setFetchingCards(false);
      });
  const { isFetching, isError, isFetched } = useQuery({
    queryKey: ["savedCards", localStorage.getItem("authToken")],
    queryFn: fetchBookingDetails,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    cardDetails = [];
    toast.error("An Error Occured, Please Try Again Later");
  }
  return (
    <div>
      <Loader isLoading={isFetching} />
      <h1 className="text-xl font-medium mb-3">My Saved Cards</h1>
      {isFetched && (
        <div className="">
          <RadioGroup
            defaultValue="new"
            value={cardId}
            onValueChange={(value) => {
              if (!isAdmin) {
                if (value === "new") {
                  setUseSavedCard(false);
                } else {
                  setUseSavedCard(true);
                }
              }
              setCardId(value);
            }}
          >
            {cardDetails?.length === 0 ? (
              <p>No Saved Cards</p>
            ) : (
              cardDetails.length !== 0 &&
              cardDetails?.map((card: any) => (
                <div className="flex items-center max-md:flex-col max-md:justify-center md:space-x-2 w-full mb-2 bg-gray-200 p-5 max-md:p-2 rounded-xl">
                  <RadioGroupItem value={card?.id} id={card?.id} />
                  <div className="flex max-md:flex-col justify-between w-full items-center">
                    <p className="flex items-center">
                      {card?.cardBrand === "VISA" ? (
                        <IconBrandVisa size={50} />
                      ) : (
                        <IconBrandMastercard size={50} />
                      )}
                      <p>{card?.cardType}</p>
                    </p>

                    <div className="flex flex-col items-end max-md:items-center">
                      <p>
                        <span>**** **** **** {card?.last4}</span>
                      </p>
                      <p>
                        <span>
                          Expiry {card?.expMonth} {card?.expYear}
                        </span>
                      </p>
                      <p>{card?.cardholderName}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {!isAdmin && (
              <div className="flex items-center space-x-2 w-full bg-blue-200 p-5 rounded-xl mb-4">
                <RadioGroupItem value={"new"} id={"new"} />
                <div className="flex justify-between w-full ">
                  <div>
                    <p>Add New Card</p>
                  </div>
                </div>
              </div>
            )}
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default MySavedCards;

{
  /* <RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup> */
}
