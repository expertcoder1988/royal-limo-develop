import { META_CONTENT } from "@/constants/metaContent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: META_CONTENT.services.wedding.title,
  description: META_CONTENT.services.wedding.description,
  alternates: {
    canonical: "https://royallimoco.com/wedding-transportation",
  },
};

function WeddingTransportSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: `
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Wedding Transportation Service",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Wedding Transportation Service",
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
        <WeddingTransportSchema />
      </head>
      {children}
    </>
  );
};

export default layout;
