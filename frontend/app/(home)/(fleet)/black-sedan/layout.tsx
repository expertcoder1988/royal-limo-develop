import { META_CONTENT } from "@/constants/metaContent";
import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const metadata: Metadata = {
  title: META_CONTENT.blackSedan.title,
  description: META_CONTENT.blackSedan.description,
  alternates: {
    canonical: "https://royallimoco.com/black-sedan",
  },
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://royallimoco.com/black-sedan" />
      </Head>
      {children}
    </>
  );
};

export default layout;
