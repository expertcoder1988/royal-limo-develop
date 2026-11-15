"use client";
import AboutUsHero from "@/components/common/AboutUsServicesHero";
import WhyRoyalLimoCardAboutUs from "@/components/common/WhyRoyalLimoCardAboutUs";
import { headingStyle2 } from "@/constants/staticInfo";
import car1 from "@/assets/car1.webp";
import { aboutUsContent } from "@/constants/seoContent";
import FloatingWhatsAppComponent from "@/components/common/FloatingWhatsAppComponent";

const AboutUs = () => {
  const heroData = {
    title: "About Us",
    description: aboutUsContent.aboutUsParagraph,
  };
  return (
    <div className="flex flex-col">
      <AboutUsHero data={heroData} />
      <div className="py-14 relative bg-gradient-to-b from-white to-gray-100">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <h1 className={headingStyle2}>
              {aboutUsContent.whyRoyalLimoHeading}
            </h1>
            <p className="opacity-65">
              {aboutUsContent.whyRoyalLimoDescription}
            </p>
          </div>
          <div className="z-10">
            {
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                {aboutUsContent.whyRoyalLimoPoints.map((why, index) => (
                  <div className="z-10" key={index}>
                    <WhyRoyalLimoCardAboutUs key={index} why={why} />
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
        <img 
          src={car1.src}
          draggable="false"
          alt="GMC Yukon - Why Royal Limo"
          title="GMC Yukon - Why Royal Limo"
          className="object-cover rounded-md absolute bottom-0 right-0 w-[50%] z-0 opacity-10 selectDisable"
        />
      </div>
      {/* <div className="bg-secondary py-24">
        <h1 className={headingStyle2}>Testimonials</h1>
        <div className="container">
          {
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex my-4">
                  <TestimonialCard key={index} testimonial={testimonial} />
                </div>
              ))}
            </div>
          }
        </div>
      </div> */}
      <FloatingWhatsAppComponent />
    </div>
  );
};

export default AboutUs;
