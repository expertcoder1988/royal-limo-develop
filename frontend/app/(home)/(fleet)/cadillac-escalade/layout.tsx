import { META_CONTENT } from "@/constants/metaContent";
import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const metadata: Metadata = {
  title: META_CONTENT.cadillacEscalade.title,
  description: META_CONTENT.cadillacEscalade.description,
  alternates: {
    canonical: "https://royallimoco.com/cadillac-escalade",
  },
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://royallimoco.com/cadillac-escalade"
        />
      </Head>
      {children}
    </>
  );
};

export default layout;
