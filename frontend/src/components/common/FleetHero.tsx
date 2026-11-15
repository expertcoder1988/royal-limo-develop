import strip1 from "../../assets/strip1.webp";
import strip2 from "../../assets/strip2.webp";

const FleetHero = ({
  data,
}: {
  data: {
    title: string;
    description: string;
    color: string;
    capacity: string;
    image: string;
  };
}) => {
  return (
    <div className="relative md:p-20 p-5 overflow-hidden">
      <img 
        src={strip2.src}
        alt="left-strip"
        title="left-strip"
        draggable="false"
        className="absolute top-0 left-0 max-h-[70%] md:max-h-full md:max-w-none selectDisable"
      />

      <div className="gap-10 container space-y-10">
        <div className="xl:w-1/2 w-full space-y-5">
          <h1 className="text-5xl font-bold">
            {data.title ? data.title : "N/A"}
          </h1>

          {/* // image for mobile-view  */}
          <img 
            src={data.image}
            alt={data.title}
            title={data.title}
            className="cursor-pointer mx-auto md:max-w-none xl:hidden transform scale-x-[-1] "
          />

          <p className="mt-2  leading-8  md:text-lg space-y-5">
            {data.description
              ? data.description
              : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at velit maximus, luctus neque sit amet, luctus dui. Fusce nec dui sit amet urna."}
          </p>
        </div>
        <div>
          <p className="text-sm md:text-base lg:text-lg font-bold">
            <span className="text-sm md:text-base lg:text-lg font-bold mr-2 md:mr-12">
              {data.color}
            </span>
            <span className="text-sm md:text-base lg:text-lg">
              {data.capacity}
            </span>
          </p>
        </div>
      </div>
      <div
        className="h-[520px] w-[520px] bg-gradient-to-br from-primary to-tertiary absolute -top-20 -right-20 max-xl:hidden"
        style={{
          clipPath: "circle(50% at 50% 50%)",
        }}
      ></div>
      <img 
        src={strip1.src}
        alt="right-strip"
        title="right-strip"
        draggable="false"
        className="absolute top-20 right-0 rotate-12 max-xl:hidden selectDisable"
      />

      {/* //image for desktop-view */}
      <img 
        src={data.image}
        alt={data.title}
        title={data.title}
        draggable="false"
        className="absolute top-10 h-[340px] right-0 max-xl:hidden transform scale-x-[-1]"
      />
    </div>
  );
};

export default FleetHero;
