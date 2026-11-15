import { META_CONTENT } from "@/constants/metaContent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: META_CONTENT.services.corporate.title,
  description: META_CONTENT.services.corporate.description,
  alternates: {
    canonical: "https://royallimoco.com/corporate-transportation",
  },
};
function CorporateTransportSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: `
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Corporate Transportation Service",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Corporate Transportation Service",
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
        <CorporateTransportSchema />
      </head>
      {children}
    </>
  );
};

export default layout;
