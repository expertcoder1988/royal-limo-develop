import React from "react";
import Script from "next/script";

const ConnectPageToGTM = ({
  pagePath,
  pageTitle,
}: {
  pagePath: string;
  pageTitle: string;
}) => {
  return (
    <>
      <Script id="gtm-pageview" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'pageView',
            pagePath: '${pagePath}',
            pageTitle: '${pageTitle}'
          });
        `}
      </Script>
      <div>{/* Page content */}</div>
    </>
  );
};

export default ConnectPageToGTM;
