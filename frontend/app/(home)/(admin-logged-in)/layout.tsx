"use client";
import { AdminHeaders, backendURL } from "@/constants/bankendURL";
import { routes } from "@/constants/routes";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const admin_layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    fetch(`${backendURL}/admin/is-logged-in`, {
      method: "GET",
      headers: AdminHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("Your session has expired. Please login again.");
          console.log("admin layout - error");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin");
          router.push(`${routes.loginAdmin}?from=${encodeURI(pathname)}`);
        }
      })
      .finally(() => {
        console.log("admin layout");
      });
  }, []);
  return <>{children}</>;
};

export default admin_layout;
