import { META_CONTENT } from "@/constants/metaContent";
import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const metadata: Metadata = {
  title: META_CONTENT.gmcYukon.title,
  description: META_CONTENT.gmcYukon.description,
  alternates: {
    canonical: "https://royallimoco.com/gmc-yukon",
  },
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://royallimoco.com/gmc-yukon" />
      </Head>
      {children}
    </>
  );
};

export default layout;
