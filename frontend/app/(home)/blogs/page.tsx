import { backendURL } from "@/constants/bankendURL";
// import { toast } from "sonner";
import BlogsHero from "@/components/common/BlogsHero";
import FloatingWhatsAppComponent from "@/components/common/FloatingWhatsAppComponent";
import { BlogsContent } from "@/constants/seoContent";
import FeaturedBlogs from "@/old_pages/FeaturedBlogs";

async function getBlogs() {
  const res = await fetch(`${backendURL}/blog/latest`, {
    next: { tags: ["getLatestBlog"] },
  })
    .then((res) => res.json())
    .then((data) => data.blog);
  return res;
}

const Blogs = async () => {
  // need to use these blogs somewhere in addition to getting the latest blog
  const blogs = await getBlogs();
  const latestBlog = blogs;

  const heroData = {
    title: "BLOGS",
    description: BlogsContent[0].BlogsDescription,
    latestBlog: latestBlog,
  };

  return (
    <div className="flex flex-col">
      <BlogsHero data={heroData} />
      <FeaturedBlogs />
      <FloatingWhatsAppComponent />
    </div>
  );
};

export default Blogs;
