import { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "../src/index.css";
import { META_CONTENT } from "@/constants/metaContent";

export const metadata: Metadata = {
  title: META_CONTENT.root.title,
  description: META_CONTENT.root.description,
  keywords: META_CONTENT.root.keywords,
  metadataBase: new URL("https://royallimoco.com"),
  alternates: {
    canonical: "https://royallimoco.com",
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
             (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PQ9MQMX7');
            `,
          }}
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XZ5N1VLEVL"
          async={true}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
             window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ5N1VLEVL');
          `,
          }}
        />




        <link rel="icon" href="/CarLogo.svg" />
        <meta
          name="google-site-verification"
          content="EaUzPt61YeHKwWxZdXmk2zWu53pzIbEKnVpDYG5G234"
        />
      </head>
      <body>

        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PQ9MQMX7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Suspense>{children}</Suspense>
      </body>
      <Toaster position="bottom-left" duration={5000} richColors={true} />
    </html>
  );
}
