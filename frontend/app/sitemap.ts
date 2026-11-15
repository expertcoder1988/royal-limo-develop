import { backendURL } from "@/constants/bankendURL";
import { MetadataRoute } from "next";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const frontendURL = "https://royallimoco.com";
  const blogs = await fetch(`${backendURL}/blog/blogs-sitemap`, {
    next: { tags: ["sitemap"] },
  })
    .then((res) => res.json())
    .then((data) => data.blogs);
  const blog_dynamic_sitemap = blogs.map((blog: any) => ({
    url: `${frontendURL}/blogs/${blog.slug}`,
    lastModified: blog.updatedAt,
  }));

  const website_sitemap = [
    { url: `${frontendURL}/`, priority: 1.0, lastModified: new Date() },
    { url: `${frontendURL}/login`, priority: 0.8, lastModified: new Date() },
    { url: `${frontendURL}/signup`, priority: 0.8, lastModified: new Date() },
    { url: `${frontendURL}/forgot-password`, lastModified: new Date() },
    { url: `${frontendURL}/reset-password`, lastModified: new Date() },
    { url: `${frontendURL}/otp-verification`, lastModified: new Date() },
    { url: `${frontendURL}/about`, priority: 0.9, lastModified: new Date() },
    {
      url: `${frontendURL}/airport-transportation`,
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${frontendURL}/wedding-transportation`,
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${frontendURL}/corporate-transportation`,
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${frontendURL}/special-events`,
      priority: 0.9,
      lastModified: new Date(),
    },
    { url: `${frontendURL}/contact`, priority: 0.9, lastModified: new Date() },
    { url: `${frontendURL}/faqs`, priority: 0.7, lastModified: new Date() },
    { url: `${frontendURL}/myBookings`, lastModified: new Date() },
    { url: `${frontendURL}/blogs`, priority: 1.0, lastModified: new Date() },
    { url: `${frontendURL}/book`, priority: 0.9, lastModified: new Date() },
    { url: `${frontendURL}/suburban`, priority: 1.0, lastModified: new Date() },
    {
      url: `${frontendURL}/gmc-yukon`,
      priority: 1.0,
      lastModified: new Date(),
    },
    {
      url: `${frontendURL}/cadillac-escalade`,
      priority: 1.0,
      lastModified: new Date(),
    },
    {
      url: `${frontendURL}/black-sedan`,
      priority: 1.0,
      lastModified: new Date(),
    },
    ...blog_dynamic_sitemap,
  ];
  console.log("Sitemap Revalidated");
  return website_sitemap;
}
