'use client'
import React from 'react'
import ServicesCard from "@/components/common/ServicesCard";
import { ourServicesContent } from "@/constants/seoContent";

const page = () => {
  return (
   <ServicesCard data={ourServicesContent.services[0]} />
  )
}

export default page