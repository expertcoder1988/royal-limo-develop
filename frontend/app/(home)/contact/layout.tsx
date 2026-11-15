import React from "react";
import QueryClientProviderLayout from "@/layouts/query-client-provider-layout";

import { Metadata } from "next";
import { META_CONTENT } from "@/constants/metaContent";
import Head from "next/head";
export const metadata: Metadata = {
  title: META_CONTENT.contact_us.title,
  description: META_CONTENT.contact_us.description,
  alternates: {
    canonical: "https://royallimoco.com/contact",
  },
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://royallimoco.com/contact" />
      </Head>
      <QueryClientProviderLayout>{children}</QueryClientProviderLayout>
    </>
  );
};

export default layout;
