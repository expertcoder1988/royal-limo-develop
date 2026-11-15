import aboutImage from "@/assets/aboutImage.webp";
import strip1 from "@/assets/strip1.webp";
import strip2 from "@/assets/strip2.webp";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import Link from "next/link";

const AboutUsServicesHero = ({
  data,
}: {
  data: {
    title: string;
    description: string;
  };
}) => {
  return (
    <div className="relative md:p-20 p-5 overflow-hidden">
      <img 
        src={strip2.src}
        alt="hero"
        title="hero"
        className="absolute top-0 left-0 max-xl:hidden"
      />

      <div className="gap-10 container">
        <div className="xl:w-1/2 w-full space-y-8">
          <h2 className="text-5xl font-bold">
            {data.title ? data.title : "N/A"}
          </h2>
          <p className="mt-2 leading-8 text-[18px]">
            {data.description
              ? data.description
              : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at velit maximus, luctus neque sit amet, luctus dui. Fusce nec dui sit amet urna."}
          </p>
          <div className="space-x-4 flex ">
            <Link href={routes.bookNow}>
              <Button className="w-52 z-10" variant={"gradient"}>
                Get a Quote
              </Button>
            </Link>
            <Link href={routes.bookNow}>
              <Button className="w-52">Book Now</Button>
            </Link>
          </div>
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
        alt="hero"
        title="hero"
        className="absolute top-20 right-0 rotate-12 max-xl:hidden"
      />

      <img 
        src={aboutImage.src}
        alt="Royal Limo Co. SUV"
        title="Royal Limo Co. SUV"
        className="absolute top-10 right-0 max-xl:hidden"
      />
    </div>
  );
};

export default AboutUsServicesHero;
