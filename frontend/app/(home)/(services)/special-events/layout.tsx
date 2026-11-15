import { META_CONTENT } from "@/constants/metaContent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: META_CONTENT.services.special.title,
  description: META_CONTENT.services.special.description,
  alternates: {
    canonical: "https://royallimoco.com/special-events",
  },
};

function SpecialEventsTransportSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: `
          {
            "@context": "https://schema.org",
            "@type": "Service", 
            "serviceType": "Special Events Transportation",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Special Events Transportation",
              "areaServed": "Minnesota",
              "address": "16632 English Path Lakeville MN, 55044"
            },
            "areaServed": {
              "@type": "Minnesota",
              "name": "Lakeville Rosemount Minneapolis Apple Valley Edina Wayzata Eden Prairie Savage Prior Lake"
            },
            "priceRange": "$$",
            "termsOfService": "https://royallimoco.com/contact",
            "additionalType": "https://schema.org/luxurycarService"
          }
        `,
      }}
    />
  );
}
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <head>
        <SpecialEventsTransportSchema />
      </head>
      {children}
    </>
  );
};

export default layout;
