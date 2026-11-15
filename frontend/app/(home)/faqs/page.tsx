"use client";
import ContactFAQHeader from "@/components/common/ContactFAQHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { FAQsContent } from "@/constants/seoContent";
import FloatingWhatsAppComponent from "@/components/common/FloatingWhatsAppComponent";
import React from "react";

const FAQsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("General Section");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-14 pb-14">
      <ContactFAQHeader isFaq={true} setSearch={setSearch} search={search} />
      <div className="container lg:flex gap-8 my-0">
        <div className="w-96 flex flex-col justify-start items-start p-8 shadow-xl border-[1px]  max-lg:hidden">
          {
            //get all the categories and remove duplicates
            Array.from(new Set(FAQsContent.map((faq) => faq.category))).map(
              (category: any, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSearch(""), setSelectedCategory(category);
                  }}
                  className={`m-2 p-3 cursor-pointer ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground px-6 "
                      : ""
                  }`}
                >
                  <h2 className="text-lg font-normal">{category}</h2>
                </div>
              )
            )
          }
        </div>
        <Select
          defaultValue={selectedCategory}
          onValueChange={(value) => {
            setSearch(""), setSelectedCategory(value);
          }}
        >
          <SelectTrigger className="lg:hidden my-5">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent className="z-10">
            <SelectGroup className="z-10">
              {
                //get all the categories and remove duplicates
                Array.from(new Set(FAQsContent.map((faq) => faq.category))).map(
                  (category, index) => (
                    <SelectItem value={category} key={index}>
                      <SelectLabel className="font-normal">
                        {category}
                      </SelectLabel>
                    </SelectItem>
                  )
                )
              }
            </SelectGroup>
          </SelectContent>
        </Select>
        <Accordion type="single" collapsible className="w-full">
          {search === ""
            ? FAQsContent.filter(
                (faq) => faq.category === selectedCategory
              ).map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <h3>{faq.question}</h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: faq.answer,
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))
            : FAQsContent.filter((faq) => {
                return (
                  faq.question.toLowerCase().includes(search.toLowerCase()) ||
                  faq.answer?.toLowerCase().includes(search.toLowerCase())
                );
              }).map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: faq.answer,
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
        </Accordion>
      </div>
      <FloatingWhatsAppComponent />
    </div>
  );
};

export default FAQsPage;
