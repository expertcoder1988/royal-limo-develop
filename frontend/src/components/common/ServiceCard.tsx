
const ServiceCard = ({
  service,
}: {
  service: {
    name: string;
    description: string;
    image: string;
  };
}) => {
  return (
    <div className="m-2">
      <div className="p-4 w-96 h-[22.5rem] max-md:w-72 max-md:h-full flex flex-col gap-4 bg-white shadow-md rounded-3xl items-center text-center">
        <div className="space-y-2 flex flex-col items-center">
          <img
            src={service.image}
            alt={service.name}
            title={service.name}
            width={50}
            height={50}
          />
          <p className="text-xl font-medium">{service.name}</p>
        </div>
        <p className="text-sm font-normal">{service.description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
