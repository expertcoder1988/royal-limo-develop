import { META_CONTENT } from "@/constants/metaContent";
import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const metadata: Metadata = {
  title: META_CONTENT.blog.title,
  description: META_CONTENT.blog.description,
  alternates: {
    canonical: "https://royallimoco.com/blogs",
  },
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://royallimoco.com/blogs" />
      </Head>
      {children}
    </>
  );
};

export default layout;
