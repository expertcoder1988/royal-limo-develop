import { backendURL } from "@/constants/bankendURL";
import FeaturedBlogs from "@/old_pages/FeaturedBlogs";
import { Metadata } from "next";
import Head from "next/head";

export const generateStaticParams = async () => {
  const res = await fetch(`${backendURL}/blog/blogs`, {
    next: { tags: ["getAllBlogs"] },
  });
  const data = await res.json();
  return data.blogs.map((blog: any) => ({
    slug: blog.slug,
  }));
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blogDetail = await getBlog(params.slug);

  if (!blogDetail?.slug) {
    return {
      title: "Blog not found",
      description: "The blog you are looking for does not exist.",
      openGraph: {
        title: "Blog not found",
        description: "The blog you are looking for does not exist.",
      },
    };
  }

  return {
    title: blogDetail.title,
    description:
      blogDetail.metaDescription || "Default meta description for this blog",
    alternates: {
      canonical: `https://royallimoco.com/blogs/${blogDetail.slug}`,
    },
    openGraph: {
      title: blogDetail.title,
      description:
        blogDetail.metaDescription || "Default meta description for this blog",
      images: [
        {
          url: `${backendURL.replace("/api", "")}${blogDetail.imageUrl}`,
          alt: blogDetail.imageAltText,
        },
      ],
    },
  };
}
async function getBlog(slug: string) {
  const blog = await fetch(`${backendURL}/blog/blog/${slug}`, {
    next: { tags: [`getBlog:${slug}`] },
  }).then((res) => res.json());

  if (blog.content) {
    blog.content = blog.content.replace(
      /<h1>/g,
      "<h1 class='text-3xl font-bold inline-block pt-2'>"
    );
    blog.content = blog.content.replace(
      /<h2>/g,
      "<h2 class='text-2xl font-bold inline-block pt-2'>"
    );
    blog.content = blog.content.replace(
      /<h3>/g,
      "<h3 class='text-xl font-bold inline-block pt-2'>"
    );
    blog.content = blog.content.replace(/<ul>/g, "<ul class='list-disc'>");
    blog.content = blog.content.replace(/<ol>/g, "<ol class='list-decimal'>");

    blog.content = blog.content.replace(/<b>/g, "<strong>");
    blog.content = blog.content.replace(/<\/b>/g, "</strong>");
    blog.content = blog.content.replace(/<i>/g, "<em>");
    blog.content = blog.content.replace(/<\/i>/g, "</em>");
    blog.content = blog.content.replace(
      /<a /g,
      "<a class='text-blue-500 underline' "
    );

    // Use a regular expression to find and replace <CTA> with buttons
    blog.content = blog.content.replace(
      /<CTA\s+link="([^"]+)"\s+label="([^"]+)"\s*\/>/g,
      (_: string, link: string, label: string) => {
        return `
        <div class="flex items-center justify-center">
        <a class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-primary px-4 py-1 rounded-lg h-10 mt-2" href="${link}" target="_blank" class="text-white">${label}</a>
        </div>`;
      }
    );
  }
  return blog;
}

const BlogDetailPage = async ({ params }: any) => {
  const blogDetail = await getBlog(params.slug);
  if (!blogDetail?.slug) {
    return <p className="text-3xl text-center pt-20">Blog not found</p>;
  }

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={`https://royallimoco.com/blogs/${blogDetail.slug}`}
        />
      </Head>
      <div className="container sm: mx-auto p-8 md:p-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
            <h1 className="text-center text-xl lg:text-3xl font-bold mb-4">
              {blogDetail.title}
            </h1>
            <div className="lg:col-span-1">
              <img 
                className="w-full h-auto object-cover rounded-lg shadow-lg mb-4"
                src={`${backendURL.replace("/api", "")}${blogDetail.imageUrl}`}
                alt={blogDetail.imageAltText}
                title={blogDetail.imageAltText}
              />
            </div>
            <div
              className="bg-white rounded-lg py-3 lg:py-6 text-sm lg:text-base text-gray-700 mb-4 lg:mb-8 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: blogDetail.content }}
            ></div>
          </div>
        </div>
        <FeaturedBlogs pageSize={3} />
      </div>
    </>
  );
};

export default BlogDetailPage;
