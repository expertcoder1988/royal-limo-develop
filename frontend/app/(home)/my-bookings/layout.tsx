import QueryClientProviderLayout from "@/layouts/query-client-provider-layout";
import React from "react";

import { Metadata } from "next";
import { META_CONTENT } from "@/constants/metaContent";
import Head from "next/head";
export const metadata: Metadata = {
  title: META_CONTENT.my_booking.title,
  description: META_CONTENT.my_booking.description,
  alternates: {
    canonical: "https://royallimoco.com/my-bookings",
  },
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://royallimoco.com/my-bookings" />
      </Head>
      <QueryClientProviderLayout>{children}</QueryClientProviderLayout>
    </>
  );
};

export default layout;
