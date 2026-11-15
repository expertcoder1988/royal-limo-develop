import { META_CONTENT } from "@/constants/metaContent";
import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const metadata: Metadata = {
  title: META_CONTENT.about.title,
  description: META_CONTENT.about.description,
  alternates: {
    canonical: "https://royallimoco.com/about",
  },
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://royallimoco.com/about" />
      </Head>
      {children}
    </>
  );
};

export default layout;
