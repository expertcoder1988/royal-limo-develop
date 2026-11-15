import QueryClientProviderLayout from "@/layouts/query-client-provider-layout";
import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://royallimoco.com/view-booking",
  },
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://royallimoco.com/view-booking" />
      </Head>
      <QueryClientProviderLayout>{children}</QueryClientProviderLayout>
    </>
  );
};

export default layout;
