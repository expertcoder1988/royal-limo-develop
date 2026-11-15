"use client";

import FormInput from "@/components/common/FormInput";
import PhoneNumberInput from "@/components/common/PhoneNumberInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { backendURL } from "@/constants/bankendURL";
import { nameRegex, passwordRegex } from "@/constants/regex";
import { routes } from "@/constants/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z
  .object({
    // firstname should only be alphabets or spaces atleast 3 characters and truncated whitespace
    firstname: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters long")
      .regex(nameRegex, "Only alphabets and spaces are allowed"),
    lastname: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters long")
      .regex(nameRegex, "Only alphabets and spaces are allowed"),
    email: z.string().email(),
    phone_number: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
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

export default function SignupPage() {
  const localStorage = typeof window !== "undefined" && window.localStorage;
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone_number: "",
      confirmPassword: "",
      password: "",
    },
  });
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    localStorage && localStorage.setItem("email", JSON.stringify(data.email));
    const sendData = {
      firstname: data.firstname.trim(),
      lastname: data.lastname.trim(),
      email: data.email.trim(),
      phoneNo: data.phone_number,
      password: data.password,
    };
    const resData = axios.post(`${backendURL}/auth/sign-up`, sendData);

    return resData;
  };
  const { mutateAsync: signUpMutation, isPending } = useMutation({
    mutationFn: onSubmit,
    onSuccess: (data) => {
      toast.success("Great To See you !!", {
        description: "You are successfully signed up, Please Login",
      });
      const authToken = data?.data?.AuthToken;
      router.replace(
        `${routes.otpVerification}?authToken=${authToken}${
          from ? `&from=${from}` : ""
        }`
      );
    },
    onError: (error: { response: { data: { errors: string } } }) => {
      toast.error("An Error Occured!", {
        description: error.response.data.errors,
      });
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => signUpMutation(data))}
          className="w-full"
        >
          <div className="w-full grid md:grid-cols-2 gap-4">
            <FormInput
              form={form}
              name="firstname"
              label="First Name"
              placeHolder="John"
              className="max-md:w-full space-y-0.5 mb-1"
            />
            <FormInput
              form={form}
              name="lastname"
              label="Last Name"
              placeHolder="Doe"
              className="max-md:w-full space-y-0.5 mb-1"
            />
            <div className="max-md:w-full space-y-0.5 mb-1">
              <PhoneNumberInput
                form={form}
                setIsValid={setIsValid}
                styles={{
                  width: "100%",
                  height: "40px",
                  border: "1px solid #E5E5E5",
                  borderRadius: "8px",
                  padding: "0.5rem",
                  backgroundColor: "white",
                  name: "phone_number",
                }}
              />
            </div>
            <FormInput
              form={form}
              name="email"
              label="Email"
              placeHolder="example@gmail.com"
              className="max-md:w-full space-y-0.5 mb-1"
            />
            <FormInput
              form={form}
              name="password"
              label="Password"
              placeHolder="********"
              className="max-md:w-full space-y-0.5 mb-1"
              type="password"
            />
            <FormInput
              form={form}
              name="confirmPassword"
              label="Confirm Password"
              placeHolder="********"
              className="max-md:w-full space-y-0.5 mb-1"
              type="password"
            />
          </div>
          <Button
            className="w-full mt-6"
            type="submit"
            disabled={isPending || !isValid}
            loader={isPending}
          >
            Sign up
          </Button>
          <p className="text-sm mt-4 text-[14px] text-center">
            Already have an account?{" "}
            <Link
              href={from ? `${routes.login}?from=${from}` : routes.login}
              className="text-[#065B69]"
            >
              Sign In
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
}
