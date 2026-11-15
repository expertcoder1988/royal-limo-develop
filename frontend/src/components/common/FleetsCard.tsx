import { FaCircle } from "react-icons/fa";

const FleetsCard = ({ data }: { data: any }) => {
  return (
    <div
      className="p-6 shadow-lg rounded-lg"
      style={{
        maxWidth: "950px",
        width: "100%",
        padding: "30px 0px 50px 70px",
        borderRadius: "18px",
        opacity: "0.8",
        background: "rgba(0, 0, 0, 0.09)",
        boxShadow: "0px 4px 25px 0px rgba(0, 0, 0, 0.13)",
      }}
    >
      <h1
        className="font-Inter text-3xl font-bold mb-5"
        style={{ color: "rgba(0, 0, 0, 1)" }}
      >
        {data?.fleets[0]?.name ? data.fleets[0]?.name : "N/A"}
      </h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {data?.fleets[0].points?.map((point: any, index: any) => (
          <li key={index} className="flex items-center">
            <div className="max-w-auto">
              {/*FaCircle component for each point */}
              <FaCircle className="w-2.5 fill-yellow-600 flex items-center justify-center m-2" />
            </div>
            <span className="font-inter text-base font-normal text-sm m-1 pl-1.5">
              {point}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FleetsCard;
