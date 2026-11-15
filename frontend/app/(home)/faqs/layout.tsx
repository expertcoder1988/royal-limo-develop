import { META_CONTENT } from "@/constants/metaContent";
import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const metadata: Metadata = {
  title: META_CONTENT.faqs.title,
  description: META_CONTENT.faqs.description,
  alternates: {
    canonical: "https://royallimoco.com/faqs",
  },
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://royallimoco.com/faqs" />
      </Head>
      {children}
    </>
  );
};

export default layout;
