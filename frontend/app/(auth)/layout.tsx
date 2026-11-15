"use client";
import AuthImage from "@/assets/AuthImage.webp";
import { AuthProvider } from "@/AuthContext";
import { routes } from "@/constants/routes";
import { authScreenWelcomePrompt } from "@/constants/seoContent";
import QueryClientProviderLayout from "@/layouts/query-client-provider-layout";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

const AuthScreenLayout = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const info = {
    title: "Welcome Back",
    description: authScreenWelcomePrompt,
  };

  const forgetPassword = searchParams?.get("resetToken") || false;

  const pathname = usePathname();
  switch (pathname) {
    case routes.login:
      info.title = "Welcome Back";
      info.description = authScreenWelcomePrompt;
      break;
    case routes.forgotPassword:
      info.title = "Forgot Password";
      info.description =
        "Enter your email to reset your password. We will send you an email to reset your password.";
      break;
    case routes.signup:
      info.title = "Create Your Account";
      info.description = "Sign up to get started with our services.";
      break;
    case routes.otpVerification:
      info.title = `Enter Verification Code ${
        forgetPassword ? "to reset your password" : "to verify your email"
      }`;
      info.description = `Please enter the verification code sent to your email`;
      break;
    case routes.resetPassword:
      info.title = "Reset Password";
      info.description = "Enter your new password to reset your password.";
      break;
    case routes.loginAdmin:
      info.title = "Welcome Back Admin";
      info.description = "Lets Get To Managing Our Limos";
      break;
  }
  return (
    <AuthProvider>
      <QueryClientProviderLayout>
        <div className="grid md:grid-cols-2">
          <div className="container flex-col justify-center flex my-4 max-md:w-4/5  w-4/5">
            <h1 className="lg:text-4xl max-lg:text-3xl max-md:text-2xl mb-3 font-[700]">
              {info.title}
            </h1>
            <p className="text-base mb-5 ">{info.description}</p>
            <div>{children}</div>
          </div>
          <img 
            loading="eager"
            src={AuthImage.src}
            alt="Auth:Left Side Image"
            title="Auth:Left Side Image"
            className="w-full h-screen object-cover object-center max-md:hidden"
          />
        </div>
      </QueryClientProviderLayout>
    </AuthProvider>
  );
};

export default AuthScreenLayout;
