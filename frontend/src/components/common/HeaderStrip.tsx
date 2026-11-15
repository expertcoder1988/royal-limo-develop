"use client";
import { EXTERNAL_LINKS } from "@/constants/externalLinks";
import { companyEmail, companyPhone } from "@/constants/staticInfo";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import Link from "next/link";

const HeaderStrip = () => {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto">
        <div className="flex md:justify-between justify-center items-center py-2">
          <div className=" flex gap-4 items-center">
            <Link
              className="cursor-pointer p-1 bg-white w-6 h-6 flex items-center justify-center rounded-full"
              href={EXTERNAL_LINKS.FACEBOOK}
              target="_blank"
            >
              <IconBrandFacebook
                stroke={1}
                color="black"
                fill="black"
                size={24}
              />
            </Link>
            <Link
              href={EXTERNAL_LINKS.INSTAGRAM}
              className="cursor-pointer p-1 bg-white w-6 h-6 flex items-center justify-center rounded-full"
            >
              <IconBrandInstagram
                stroke={2}
                color="black"
                // fill="black"
                size={24}
              />
            </Link>
            <Link
              href={EXTERNAL_LINKS.TIKTOK}
              className="cursor-pointer p-1 bg-white w-6 h-6 flex items-center justify-center rounded-full"
            >
              <IconBrandTiktok
                stroke={1}
                color="black"
                fill="black"
                size={24}
              />
            </Link>
          </div>
          <div className="text-sm font-normal text-white max-lg:hidden">
            Providing top-notch limo services
          </div>
          <div className="flex items-center gap-4 max-md:ml-4">
            <a
              className="text-sm font-normal text-white flex gap-1 items-center max-md:bg-white max-md:rounded-full max-md:p-0.5"
              href={`tel:${companyPhone}`}
            >
              <IconPhone stroke={1} size={20} color="white" fill="primary" />
              <p className="max-md:hidden">{companyPhone}</p>
            </a>

            <a
              className="text-sm font-normal text-white flex gap-1 items-center max-md:bg-white max-md:rounded-full max-md:p-0.5"
              href={`mailto:${companyEmail}`}
            >
              <IconMail stroke={1} size={20} color="white" fill="primary" />
              <p className="max-md:hidden">{companyEmail}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderStrip;
