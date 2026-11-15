// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { routes } from "@/constants/routes";
import Link from "next/link";
import { FaCircle } from "react-icons/fa";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const ServicesCard = ({
  data,
}: {
  data: {
    name: string;
    description: string[];
    image: string[];
    alt: string[];
    bottomCTAText?: string;
  };
}) => {
  return (
    <div className="flex max-lg:flex-col justify-center items-center max-lg:gap-10 gap-24">
      <div className="flex flex-col gap-8 justify-center w-full p-4">
        <h1 className="text-4xl font-medium">
          {data.name ? data.name : "N/A"}
        </h1>
        {data?.description?.map((description: string, index: number) => (
          <div
            className="flex flex-col md:flex-row w-full gap-x-8 items-center"
            key={index}
          >
            <div
              className={cn("md:w-1/2 w-full", index % 2 === 1 && "md:hidden")}
            >
              <img 
                src={
                  data.image[index]
                    ? data.image[index]
                    : "https://via.placeholder.com/150"
                }
                alt={data.alt[index] ? data.alt[index] : "event"}
                title={data.alt[index] ? data.alt[index] : "event"}
                className="w-full h-96 object-cover rounded-sm"
              />
            </div>
            <p
              className="leading-8  lg:text-[18px] md:w-1/2"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            {index % 2 !== 0 && (
              <div className="md:w-1/2 w-full max-md:hidden">
                <img 
                  src={
                    data.image[index]
                      ? data.image[index]
                      : "https://via.placeholder.com/150"
                  }
                  alt={data.alt[index] ? data.alt[index] : "event"}
                  title={data.alt[index] ? data.alt[index] : "event"}
                  className="w-full h-96 object-cover rounded-sm"
                />
              </div>
            )}
          </div>
        ))}

        <div
          className="p-6 shadow-lg rounded-lg self-center"
          style={{
            maxWidth: "950px",
            width: "100%",
            padding: "5px 0px 20px 40px",
            borderRadius: "18px",
            opacity: "0.8",
            background: "rgba(0, 0, 0, 0.09)",
            boxShadow: "0px 4px 25px 0px rgba(0, 0, 0, 0.13)",
          }}
        >
          <ul className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {data?.points?.map((point: any, index: number) => (
              <div key={index} className="flex gap-1 items-center">
                <FaCircle className="w-2.5 fill-yellow-600 flex items-center justify-center m-2" />
                <li key={index}>{point}</li>
              </div>
            ))}
          </ul>
        </div>
        <Link className="self-center" href={routes.bookNow}>
          <Button>{data.bottomCTAText || "Book Now"}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ServicesCard;
