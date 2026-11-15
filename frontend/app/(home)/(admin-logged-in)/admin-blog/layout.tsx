import { META_CONTENT } from "@/constants/metaContent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: META_CONTENT.adminBlog.title,
  description: META_CONTENT.adminBlog.description,
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
