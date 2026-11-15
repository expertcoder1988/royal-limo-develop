import { META_CONTENT } from "@/constants/metaContent";
import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const metadata: Metadata = {
  title: META_CONTENT.suburban.title,
  description: META_CONTENT.suburban.description,
  alternates: {
    canonical: "https://royallimoco.com/suburban",
  },
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://royallimoco.com/suburban" />
      </Head>
      {children}
    </>
  );
};

export default layout;
