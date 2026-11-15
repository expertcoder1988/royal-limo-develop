"use client";
import React from "react";
import { EXTERNAL_LINKS } from "@/constants/externalLinks";
import ContactFAQHeader from "@/components/common/ContactFAQHeader";
import FloatingWhatsAppComponent from "@/components/common/FloatingWhatsAppComponent";
import FormInput from "@/components/common/FormInput";
import Loader from "@/components/common/Loader";
import PhoneNumberInput from "@/components/common/PhoneNumberInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { backendURL } from "@/constants/bankendURL";
import { routes } from "@/constants/routes";
import {
  companyEmail,
  companyLocation,
  companyPhone,
  headingStyle,
} from "@/constants/staticInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconLocation,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";
const formSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 3 characters long"),
  lastname: z.string().min(2, "Last name must be at least 3 characters long"),
  email: z.string().email(),
  phone_number: z.string(),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});
const ContactUsPage = () => {
  const [isValid, setIsValid] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone_number: "",
      message: "",
    },
  });
  const contactInfo = [
    {
      conatct: companyPhone,
      icon: IconPhone,
    },

    {
      conatct: companyEmail,
      icon: IconMail,
    },

    {
      conatct: companyLocation,
      icon: IconLocation,
    },
  ];
  const router = useRouter();
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const sendData = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      phoneNo: data.phone_number,
      message: data.message,
    };
    const resData = axios.post(`${backendURL}/contact-us`, sendData);

    return resData;
  };
  const { mutateAsync: contactUsMutation, isPending } = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      toast.success("Message Sent Successfully", {
        description:
          "Your message has been sent successfully! We will get back to you soon.",
      });

      router.push(routes.home);
    },
    onError: (error: { response: { data: { errors: string } } }) => {
      toast.error("An Error Occured!", {
        description: error.response.data.errors,
      });
    },
  });
  return (
    <div className="">
      <Loader isLoading={isPending} />
      <ContactFAQHeader />
      <div className="container p-8 flex flex-col gap-14">
        <h1 className={`${headingStyle} flex flex-col gap-3`}>
          <span className="text-5xl">Still have </span>
          <span className="text-primary text-5xl font-semibold">
            some questions?
          </span>
        </h1>
        <div className="flex justify-between max-lg:flex-col items-center gap-10">
          <div className="shadow-xl p-8 flex flex-col gap-7 rounded-xl lg:w-1/3">
            <div>
              <h1 className="text-xl mb-2 font-semibold">
                Contact Information
              </h1>
              <p className="w-3/4">
                Fill up the form and we’ll get back to you in few hours.
              </p>
            </div>
            {contactInfo.map((info, index) => (
              <div key={index} className="flex gap-4">
                <info.icon size={24} color="black" />
                {info.icon === IconPhone ? (
                  <a href={`tel:${companyPhone}`}>{companyPhone}</a>
                ) : info.icon === IconMail ? (
                  <a href={`mailto:${companyEmail}`}>{companyEmail}</a>
                ) : (
                  companyLocation
                )}
              </div>
            ))}
            <div className="flex gap-4 items-center my-4">
              <Link
                className="p-1 bg-secondary w-6 h-6 flex items-center justify-center rounded-full"
                href={EXTERNAL_LINKS.FACEBOOK}
                target="_blank"
              >
                <IconBrandFacebook
                  stroke={1}
                  color="white"
                  fill="white"
                  size={24}
                />
              </Link>
              <Link
                className="p-1 bg-secondary w-6 h-6 flex items-center justify-center rounded-full"
                href={EXTERNAL_LINKS.INSTAGRAM}
                target="_blank"
              >
                <IconBrandInstagram stroke={2} color="white" size={24} />
              </Link>
              <Link
                className="p-1 bg-secondary w-6 h-6 flex items-center justify-center rounded-full"
                href={EXTERNAL_LINKS.TIKTOK}
                target="_blank"
              >
                <IconBrandTiktok
                  stroke={1}
                  color="white"
                  fill="white"
                  size={24}
                />
              </Link>
            </div>
          </div>
          <div className="w-2/3 max-lg:w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => contactUsMutation(data))}
                className="w-full"
              >
                <div className="w-full grid md:grid-cols-2 gap-4">
                  <FormInput
                    form={form}
                    name="firstname"
                    label="First Name"
                    placeHolder="John"
                    className="w-full space-y-0.5 mb-1"
                  />
                  <FormInput
                    form={form}
                    name="lastname"
                    label="Last Name"
                    placeHolder="Doe"
                    className="w-full space-y-0.5 mb-1"
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
                    className="max-md:w-full space-y-0.5 mb-2"
                  />
                </div>
                <FormInput
                  form={form}
                  label="Your Message"
                  name="message"
                  className="max-md:w-full space-y-0.5 mb-1"
                  component={
                    <Textarea
                      placeholder="Write Here"
                      className="bg-white min-h-28"
                    />
                  }
                />
                <Button
                  className="mt-6"
                  type="submit"
                  disabled={isPending || !isValid}
                  loader={isPending}
                >
                  Send Message
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <FloatingWhatsAppComponent />
    </div>
  );
};

export default ContactUsPage;
