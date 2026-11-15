"use client";
import React, { useEffect } from "react";
import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { backendURL } from "@/constants/bankendURL";
import { routes } from "@/constants/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPassword() {
  const localStorage = typeof window !== "undefined" && window.localStorage;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore

  useEffect(() => {
    if (localStorage && localStorage.getItem("rememberMe")) {
      const data = JSON.parse(localStorage.getItem("rememberMe") || "{}");
      form.setValue("email", data.email || "");
    }
  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    localStorage && localStorage.setItem("email", data.email);
    const resData = axios.post(`${backendURL}/auth/forgot-password`, {
      email: data.email,
    });
    return resData;
  };
  const { mutateAsync: forgetPasswordMutation, isPending } = useMutation({
    mutationFn: onSubmit,
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        toast.error("Error", {
          description:
            error.response.data?.error?.message || "An error occurred",
        });
      } else {
        toast.error("Error", {
          description: "An error occurred",
        });
      }
    },
    onSuccess: (data) => {
      toast.success("Email sent", {
        description: "Email sent successfully. Please check your inbox.",
      });
      const authToken = data?.data?.AuthToken;
      router.replace(routes.otpVerification + "?resetToken=" + authToken);
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => forgetPasswordMutation(data))}
          className="w-full"
        >
          <div className="flex-col flex w-full">
            <FormInput
              form={form}
              name="email"
              label="Email"
              placeHolder="example@gmail.com"
              className="w-full space-y-0.5 mb-4"
            />
            <Button
              className="w-full mt-6"
              disabled={isPending}
              loader={isPending}
            >
              Send
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
