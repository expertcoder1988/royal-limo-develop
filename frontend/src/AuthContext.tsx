"use client";
import { createContext, useState } from "react";
const AuthContext = createContext({});

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const localStorage = typeof window !== "undefined" && window.localStorage;
  const [auth, setAuth] = useState({
    token:
      localStorage && localStorage.getItem("authToken")
        ? localStorage.getItem("authToken")
        : "",
    user: JSON.parse((localStorage && localStorage.getItem("user")) || "{}"),
  });

  const [adminAuth, setAdminAuth] = useState({
    adminToken:
      localStorage && localStorage.getItem("adminToken")
        ? localStorage.getItem("adminToken")
        : "",
    user: JSON.parse((localStorage && localStorage.getItem("admin")) || "{}"),
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth, setAdminAuth, adminAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
