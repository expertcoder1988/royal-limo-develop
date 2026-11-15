"use client";
import React from "react";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { backendURL } from "@/constants/bankendURL";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";

import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OTPInput from "react-otp-input";

import { toast } from "sonner";
import * as z from "zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  code: z.string().min(4, "OTP must be 4 digits"),
});

export default function OTPVerification() {
  const localStorage = typeof window !== "undefined" && window.localStorage;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [token, setToken] = useState({
    accessToken: "",
  });

  const [responseAuthToken, setResponseAuthToken] = useState("");
  const [forgetPassword, setForgetPassword] = useState(false);
  useEffect(() => {
    if (!pathname) return;

    if (searchParams?.get("resetToken")) {
      setForgetPassword(true);
      setToken({
        accessToken: searchParams.get("resetToken") || "",
      });
    }
    if (searchParams?.get("authToken")) {
      setForgetPassword(false);
      setToken({
        accessToken: searchParams.get("authToken") || "",
      });
    }
  }, [pathname]);
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const url = forgetPassword
      ? "/auth/verify-forgot-password"
      : "/auth/verify-signup";
    const resData = axios.post(
      `${backendURL}${url}`,
      {
        code: data.code,
      },
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    return resData;
  };
  const { mutate: resetPasswordMutation, isSuccess } = useMutation({
    mutationFn: onSubmit,
    onError: (error: { response: { data: { errors: string } } }) => {
      toast.error("Error", {
        description: error?.response?.data?.errors,
      });
    },
    onSuccess: (data) => {
      toast.success("OTP Accepted", {
        description: "OTP accepted successfully. Please login again.",
      });
      if (forgetPassword) {
        router.replace(
          routes.resetPassword + "?resetToken=" + data.data.AuthToken
        );
      } else {
        setResponseAuthToken(data.data.AuthToken);
      }
      localStorage && localStorage.setItem("authToken", data.data.AuthToken);
    },
  });
  const fetchUserData = () =>
    axios
      .get(backendURL + "/auth/get-user", {
        headers: {
          Authorization: `Bearer ${responseAuthToken}`,
        },
      })
      .then((res) => res.data)
      .catch((err) => alert(err));
  const { isFetching, data: userData } = useQuery({
    queryKey: ["user"],
    enabled: !!isSuccess && !forgetPassword,
    queryFn: fetchUserData,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
  const { setAuth } = useAuth() as any;
  useEffect(() => {
    if (forgetPassword) return;
    if (userData) {
      setAuth({ token: responseAuthToken, user: userData });
      if (localStorage) {
        localStorage.setItem("user", JSON.stringify(userData));
        if (localStorage.getItem("location")) {
          router.replace(localStorage.getItem("location") || routes.bookNow);
          localStorage.removeItem("location");
          return;
        }
        router.replace(routes.home);
      }
    }
  }, [userData, forgetPassword]);
  return (
    <>
      <Form {...form}>
        <form
          style={{ width: "100%" }}
          onSubmit={form.handleSubmit((data) => resetPasswordMutation(data))}
          className="space-t-8"
        >
          <div className="flex-col justify-center flex w-full">
            <Loader isLoading={isFetching} />
            <OTPInput
              // renderSeparator={<span></span>}
              // render Separator should be a space
              renderSeparator={<span className="mx-2 max-md:max-1"></span>}
              renderInput={(props) => <input {...props} />}
              value={form.watch("code")}
              onChange={(code) => {
                form.setValue("code", code, { shouldValidate: true });
              }}
              numInputs={6}
              inputStyle="h-12 w-12 max-md:h-8 max-md:w-8 border-2 border-[#E5E5E5] rounded-md text-center text-2xl max-md:text-xl font-[500] text-[#333333] focus:outline-none focus:border-[#FBBF24]  my-10"
              skipDefaultStyles
            />

            <Button className="w-3/5 max-md:w-full mt-6">Send</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
