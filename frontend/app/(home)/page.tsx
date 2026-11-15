"use client";
import car1 from "@/assets/car1.webp";
import FAQs from "@/components/common/FAQs";
import FloatingWhatsAppComponent from "@/components/common/FloatingWhatsAppComponent";
import HeaderHero from "@/components/common/HeaderHero";
import LandingPageBookingCard from "@/components/common/LandingPageBookingCard";
import ServiceCard from "@/components/common/ServiceCard";
import VehicleCard from "@/components/common/VehicleCard";
import WhyRoyalLimoCard from "@/components/common/WhyRoyalLimoCard";
import { aboutUsContent, landingPageContent } from "@/constants/seoContent";
import { headingStyle2, vehicleDetails } from "@/constants/staticInfo";
import Link from "next/link";


const LandingPage = () => {
  return (
    <div className="bg-white relative">
      <head>
        <link rel="canonical" href="https://royallimoco.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Royal Limo Co",
              image:
                "https://royallimoco.com/_next/static/media/logofooter.f1312e21.webp",
              "@id": "",
              url: "https://royallimoco.com/",
              telephone: "651-890-2400",
              address: {
                "@type": "PostalAddress",
                streetAddress: "16632 English path",
                addressLocality: "Lakevilla",
                addressRegion: "MN",
                postalCode: "55044",
                addressCountry: "US",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
              sameAs:
                "https://www.facebook.com/people/Royal-Limo-Co/61558942433369/?mibextid=ZbWKwL",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "WebSite",
              name: "Royal limo Co",
              url: "https://royallimoco.com/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://royallimoco.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <div className="relative flex flex-col">
        <HeaderHero />
        <div className="flex justify-center">
          <div className="hidden lg:block border-2 rounded-xl absolute top-[360px] z-10 bg-white">
            <LandingPageBookingCard />
          </div>
        </div>
        <div className="bg-secondary lg:pt-56 pb-24">
          <div className="flex flex-col gap-14 container mt-8">
            <h2 className={headingStyle2}>
              {landingPageContent.secondaryHeading1}
            </h2>
            <p className="text-primary-foreground" style={{textAlign:"center"}}>
            {landingPageContent.secondaryHeading1d}
           
            </p>
            <div>
              {
                <div className="flex flex-wrap justify-center gap-4 mt-10">
                  {vehicleDetails.map((vehicle, index) => (
                    <VehicleCard key={index} vehicle={vehicle} />
                  ))}
                </div>
              }
            </div>
            <h2 className={headingStyle2}>
              {landingPageContent.secondaryHeading2}
            </h2>
            <p className="text-primary-foreground" style={{textAlign:"center"}}>
            {landingPageContent.secondaryHeading2d}
           
            </p>
            {
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                {landingPageContent.secondaryHeading2Services.map(
                  (serv, index) => (
                    <Link href={serv.href} key={index}>
                      <ServiceCard service={serv} />
                    </Link>
                  )
                )}
              </div>
            }
          </div>
        </div>
        <div className="my-14 relative container ">
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <h2 className={headingStyle2}>
              {landingPageContent.secondaryHeading3}
            </h2>
            <p className="opacity-65">
              {landingPageContent.heading3Description}
            </p>
          </div>
          <div className="z-10">
            {
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                {aboutUsContent.whyRoyalLimoPoints.map((why, index) => (
                  <WhyRoyalLimoCard key={index} why={why} />
                ))}
              </div>
            }
          </div>
          <img 
            src={car1.src}
            draggable={false}
            alt="GMC Yukon - Why Royal Limo?"
            title="GMC Yukon - Why Royal Limo?"
            className="object-cover rounded-md absolute -bottom-20 right-0 w-[50%] z-0 opacity-15 selectDisable"
          />
        </div>
        <div className="bg-secondary pt-24 pb-24 my-14">
          <div className="my-14 container">
            <FAQs content={landingPageContent.FAQs} />
          </div>
        </div>
      </div>
      <FloatingWhatsAppComponent />
    </div>
  );
};

export default LandingPage;
