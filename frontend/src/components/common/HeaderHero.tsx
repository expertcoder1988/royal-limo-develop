import car1 from "@/assets/car1.webp";
import car2 from "@/assets/car2.webp";
import car3 from "@/assets/car3.webp";
import car4 from "@/assets/car4.webp";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { useRouter } from "next/navigation";

const HeaderHero = () => {
  const router = useRouter();
  const headerClass = "text-secondary font-semibold";
  return (
    <div className="relative bg-white">
      <div className="pt-16 pb-28 bg-white lg:flex-row justify-between z-10 items-center relative container clip-path-polygon">
        <div className="space-y-6">
          <h1
            className="lg:text-[45px] text-primary md:text-[30px] font-bold leading-[30px] lg:leading-[50px] lg:w-[642px] md:w-[500px] text-[30px]"
            style={{
              textTransform: "uppercase",
            }}
          >
            <span className={headerClass}>Luxury Travel </span>Redefined Premium {" "}
            <span className={headerClass}>Limo Servies,</span> Minnesota USA<span className={headerClass}> Book Your Royal Limo Today!</span>
          </h1>
          <div className="md:space-x-6 space-y-6 md:space-y-0 flex md:flex-row flex-col w-3/4">
            <Button
              size="lg"
              variant={"gradient"}
              className="w-[200px]"
              onClick={() => {
                localStorage.removeItem("quote");
                router.push(routes.bookNow);
              }}
            >
              Get a Quote
            </Button>
            <Button
              size="lg"
              variant={"default"}
              className="w-[200px]"
              onClick={() => {
                router.push(routes.bookNow);
              }}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>

      <div className="z-0 object-contain object-right lg:absolute lg:top-0 right-0 h-full container pb-28 bg-gradient-to-b from-tertiary to-primary hidden lg:block"></div>
      <div className="relative lg:static z-0 lg:top-0 right-0 h-full container pb-96 lg:pb-0 bg-gradient-to-b from-tertiary to-primary">
        <img 
          src={car3.src}
          alt="Suburban"
          title="Suburban"
          className="object-contain object-right absolute top-12 right-28 md:right-48 z-10 w-2/3 md:w-auto"
        />
        <img 
          src={car1.src}
          alt="GMC Yukon"
          title="GMC Yukon"
          className="object-contain object-right absolute top-14 right-20 md:right-40 z-10 w-2/3 md:w-auto"
        />
        <img 
          src={car2.src}
          alt="Cadilac Esclade"
          title="Cadilac Esclade"
          className="object-contain object-right absolute top-24 right-6 z-10 w-2/3 md:w-auto"
        />
        <img 
          src={car4.src}
          alt="Black Sedan"
          title="Black Sedan"
          className="object-contain object-right absolute top-36 right-0 z-10 w-2/3 md:w-auto"
        />
      </div>
    </div>
  );
};

export default HeaderHero;
