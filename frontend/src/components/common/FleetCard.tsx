const FleetCard = ({
  data,
}: {
  data: {
    title: string;
    description: string;
    color: string;
  };
}) => {
  return (
    <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-medium">{data.title}</p>
        <p className="text-base font-normal">{data.description}</p>
        <p className="text-sm font-normal">{data.color}</p>
      </div>
    </div>
  );
};

export default FleetCard;
