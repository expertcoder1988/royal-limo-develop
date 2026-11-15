import FloatingWhatsAppComponent from "@/components/common/FloatingWhatsAppComponent";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <FloatingWhatsAppComponent />
    </div>
  );
};

export default layout;
