"use client";
import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { backendURL } from "@/constants/bankendURL";
import { passwordRegex } from "@/constants/regex";
import { routes } from "@/constants/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const searchParams = useSearchParams();
  const resetToken = searchParams?.get("resetToken");

  const [token, setToken] = useState({
    accessToken: "",
  });
  useEffect(() => {
    if (resetToken)
      setToken({
        accessToken: resetToken,
      });
  }, [resetToken]);
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const resData = axios.post(
      `${backendURL}/auth/reset-password`,
      {
        newPassword: data.password,
      },
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    return resData;
  };
  const router = useRouter();
  const { mutate: resetPasswordMutation, isPending } = useMutation({
    mutationFn: onSubmit,
    onError: (error: { response: { data: { errors: string } } }) => {
      toast.error("Error", {
        description: error?.response?.data?.errors,
      });
    },
    onSuccess: () => {
      toast.success("Password reset", {
        description: "Password reset successfully. Please login again.",
      });
      router.push(routes.login);
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => resetPasswordMutation(data))}
          className=" w-full"
        >
          <div className="flex-col justify-center items-center flex w-full">
            <FormInput
              form={form}
              name="password"
              label="Password"
              placeHolder="********"
              className="w-full space-y-0.5 mb-4"
              type="password"
            />
            <FormInput
              form={form}
              name="confirmPassword"
              label="Confirm Password"
              placeHolder="********"
              className="w-full space-y-0.5 mb-4"
              type="password"
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
