import AboutUsServicesHero from "@/components/common/AboutUsServicesHero";
import FloatingWhatsAppComponent from "@/components/common/FloatingWhatsAppComponent";
import VehicleCard from "@/components/common/VehicleCard";
import { ourServicesContent } from "@/constants/seoContent";
import { headingStyle2, vehicleDetails } from "@/constants/staticInfo";
import React from "react";
import { FaCircle } from "react-icons/fa";

const layout = ({ children }: { children: React.ReactNode }) => {
  const heroData = {
    title: "Our Services",
    description: ourServicesContent.ourServicesParagraph,
  };

  return (
    <div className="flex flex-col">
      <AboutUsServicesHero data={heroData} />
      <div className="container">
        <div className="max-lg:py-10 mb-10">{children}</div>
        <div>
          <div className="flex flex-col gap-y-8 mb-8">
            <h2 className={headingStyle2}>Areas we cover</h2>
            <p>
              Royal Limo proudly offers our luxury transportation services
              across various locations in Minnesota. Whether you're planning a
              special event or require airport transfers, we are here to serve
              you in the following areas:
            </p>
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
                {ourServicesContent.CoveredAreasData?.map(
                  (point: any, index: number) => (
                    <div key={index} className="flex gap-1 items-center">
                      <FaCircle className="w-2.5 fill-yellow-600 flex items-center justify-center m-2" />
                      <li key={index}>{point}</li>
                    </div>
                  )
                )}
              </ul>
            </div>
          </div>

          <h2 className={headingStyle2}>
            Choose from our fleet of premium vehicles
          </h2>
          {
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {vehicleDetails.map((vehicle, index) => (
                <div key={index} className="flex justify-center">
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          }
        </div>
      </div>
      <FloatingWhatsAppComponent />
    </div>
  );
};

export default layout;
