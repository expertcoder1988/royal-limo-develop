"use client";
import FormInput from "@/components/common/FormInput";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { backendURL } from "@/constants/bankendURL";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default function LoginPage() {
  const { setAuth } = useAuth() as any;
  const localStorage = typeof window !== "undefined" && window.localStorage;

  const searchParams = useSearchParams();
  const from = searchParams?.get("from");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [rememberMe, setRememberMe] = useState(
    localStorage && localStorage.getItem("rememberMe") ? true : false
  );
  useEffect(() => {
    if (localStorage && localStorage.getItem("rememberMe")) {
      const data = JSON.parse(localStorage.getItem("rememberMe") || "{}");
      form.setValue("email", data.email);
      form.setValue("password", data.password);
    }
  }, []);
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (localStorage)
      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          JSON.stringify({ email: data.email, password: data.password })
        );
      } else if (!rememberMe) {
        localStorage.removeItem("rememberMe");
      }

    const resData = await axios.post(`${backendURL}/auth/login`, {
      email: data.email,
      password: data.password,
    });
    return resData;
  };
  const { mutate: signInMutation, isPending } = useMutation({
    mutationFn: onSubmit,
    onSuccess: (data) => {
      toast.success("Welcome Back", {
        description: "You are successfully signed in",
      });
      if (localStorage) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        localStorage.removeItem("authToken");
        localStorage.setItem("authToken", data.data.AuthToken);
      }
      mutateUser(data.data.AuthToken);
    },
    onError: (error: { response: { data: { errors: string } } }) => {
      toast.error("Error", {
        description: error?.response?.data?.errors,
      });
    },
  });
  const fetchUserData = (token: string) =>
    axios
      .get(backendURL + "/auth/get-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => ({ user: res.data, token }))
      .catch((err) => alert(err));
  const { isPending: isUserPending, mutateAsync: mutateUser } = useMutation({
    mutationFn: fetchUserData,
    //@ts-ignore
    onSuccess: ({ user, token }) => {
      setAuth({ token, user });
      if (localStorage) localStorage.setItem("user", JSON.stringify(user));
      router.replace(from ? from : routes.home);
    },
    onError: (err) => console.log(err),
  });

  return (
    <>
      <Loader isLoading={isPending || isUserPending} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => signInMutation(data))}
          className="w-full"
        >
          <div className="flex-col flex w-full">
            <FormInput
              form={form}
              name="email"
              label="Email"
              placeHolder="example@gmail.com"
              className=" max-md:w-full space-y-0.5 mb-4"
            />
            <FormInput
              form={form}
              name="password"
              label="Password"
              placeHolder="********"
              className=" max-md:w-full space-y-0.5 mb-4"
              type="password"
            />
            <div className="flex max-sm:flex-col max-sm:gap-5 justify-between items-center mx-4">
              <div className="flex items-center">
                <Checkbox
                  id="terms1"
                  className="mr-3"
                  name="rememberMe"
                  onCheckedChange={() => setRememberMe(!rememberMe)}
                  checked={rememberMe}
                />
                <label
                  htmlFor="terms1"
                  className="text-sm font-[400] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember Me
                </label>
              </div>
              <Link href={routes.forgotPassword}>Forgot Password</Link>
            </div>
            <Button
              className=" max-md:w-full mt-6"
              disabled={isPending}
              loader={isPending}
            >
              Login
            </Button>
            <p className="text-sm mt-4 text-[14px] text-center ">
              Don&apos;t have an account?{" "}
              <Link
                href={from ? `${routes.signup}?from=${from}` : routes.signup}
                className="text-[#065B69]"
                onClick={() => {
                  from &&
                    localStorage &&
                    localStorage.setItem("location", from);
                }}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
}
