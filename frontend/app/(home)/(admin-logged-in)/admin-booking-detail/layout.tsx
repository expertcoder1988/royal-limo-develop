import QueryClientProviderLayout from "@/layouts/query-client-provider-layout";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProviderLayout>{children}</QueryClientProviderLayout>;
};

export default layout;
