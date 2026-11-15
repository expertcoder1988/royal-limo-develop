import Link from "next/link";
import aboutImage from "../../assets/aboutImage.webp";
import strip2 from "../../assets/strip2.webp";
import { Button } from "../ui/button";
import { routes } from "@/constants/routes";
import { backendURL } from "@/constants/bankendURL";

interface HeroData {
  title: string;
  description: string;
  latestBlog?: {
    title: string;
    content: string;
    imageUrl: string;
    _id: string;
    slug: string;
    metaDescription: string;
    imageAltText: string;
  };
}

const BlogsHero = ({ data }: { data: HeroData }) => {
  return (
    <div className="relative md:pb-0 md:p-20 overflow-hidden bg-gradient-to-b from-white to-gray-300 pb-0ss">
      <img 
        src={strip2.src}
        alt="hero"
        title="hero"
        className="absolute top-0 left-0 max-xl:hidden"
      />

      <div className="gap-10 container">
        <div className="xl:w-1/2 w-full space-y-8 mt-6">
          <h1 className="text-5xl font-bold">
            {data.title ? data.title : "N/A"}
          </h1>
          <p className="mt-2 p-2 leading-8 text-[18px]">
            Welcome to the <b>Royal Limo Co.</b> Blog! Here, you’ll find{" "}
            <b>expert advice</b>, trends, and insights on{" "}
            <b>luxury transport</b>. Discover how to make the most of your
            travel experiences, from special events to business trips. Our{" "}
            <b>professional chauffeurs</b> are dedicated to providing you with a
            seamless and enjoyable experience with the <b>Limousine service</b>.
            Dive into our articles for behind-the-scenes looks and valuable
            advice that enhance every journey with Royal Limo.
          </p>
        </div>
      </div>

      <div
        className="h-[520px] w-[520px] bg-gradient-to-br from-primary to-tertiary absolute -top-20 -right-20 max-xl:hidden"
        style={{ clipPath: "circle(50% at 50% 50%)" }}
      ></div>

      <img 
        src={aboutImage.src}
        alt="Royal Limo Co. SUV"
        title="Royal Limo Co. SUV"
        className="absolute top-10 right-0 max-xl:hidden"
      />

      {data.latestBlog && (
        <div className="flex flex-wrap md:pt-20">
          <div className="md:py-10  lg:pt-46 container mx-auto md:mt-20 md:px-0 relative w-full">
            <div className="w-full md:w-1/2 md:h-[300px] md:max-w-lg md:absolute md:right-0">
              <img 
                src={`${backendURL.replace("/api", "")}${
                  data.latestBlog.imageUrl
                }`}
                alt="Latest Blog Image"
                title="Latest Blog Image"
                className="w-full h-full rounded-[24px] object-cover "
              />
            </div>

            <div className="w-full md:w-1/2 mt-4 md:mt-0  md:left-12 lg:pr-32 sm:pt-5 space-y-4 md:space-y-8">
              <div className="md:ml-12 ">
                <Link
                  href={`${routes.blogDetail.replace(
                    ":slug",
                    `${encodeURI(data.latestBlog.slug)}`
                  )}`}
                >
                  <p className="text-2xl pb-9 md:text-3xl font-bold text-center md:text-left">
                    {data.latestBlog.title.substring(0, 60)}
                  </p>
                </Link>
                <p className="mt-4 pb-9 leading-7 text-lg text-center lg:pr-5 md:text-left">
                  {data.latestBlog.content
                    .replace(/<\/?[^>]+(>|$)/g, "")
                    .substring(0, 300)}
                  ...
                </p>
                <div className="flex justify-center md:justify-start mt-6">
                  <Button className="rounded-lg w-32 h-10 mb-12">
                    <Link
                      href={`${routes.blogDetail.replace(
                        ":slug",
                        `${encodeURI(data.latestBlog.slug)}`
                      )}`}
                    >
                      Read More
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsHero;
