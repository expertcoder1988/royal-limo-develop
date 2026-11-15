"use client";
import { Button } from "@/components/ui/button";
import { APIHeaders, AdminHeaders, backendURL } from "@/constants/bankendURL";
import { routes } from "@/constants/routes";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { revalidateBlogs, revalidateUpdatedBlog } from "../../../actions";

const UpdateBlog = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() || "";
  const slug = searchParams?.get("slug");
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!slug && isClient) {
    toast.error("Invalid URL. Please try again.");
    router.replace(routes.adminBlogs);
  }
  useEffect(() => {
    const isAdmin = !!localStorage.getItem("adminToken");
    if (!isAdmin) {
      toast.error("You are not authorized. Please login as admin.");
      router.replace(`/login-admin?from=${pathname}`);
    }
  }, []);

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    slug: "",
    metaDescription: "",
    imageAltText: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    const url = `${backendURL}/blog/blog/${slug}`;
    try {
      const response = (await axios.get(url).catch(() => {
        router.replace(routes.adminBlogs);
      })) as any;

      const { title, content, slug, metaDescription, imageAltText, imageUrl } =
        response.data;
      setBlog({
        title,
        content,
        slug,
        metaDescription,
        imageAltText,
        imageUrl,
      });

      if (imageUrl) {
        setImageUrlPreview(`${backendURL.replace("/api", "")}${imageUrl}`);
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast.error("Failed to fetch blog details. Please try again.");
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setBlog((prevBlog) => ({
      ...prevBlog,
      [name]: value,
    }));
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlog((prevBlog) => ({
        ...prevBlog,
        image: file,
        imageUrl: URL.createObjectURL(file),
      }));
      setImageFile(file);
      setImageUrlPreview(URL.createObjectURL(file));
    }
  };

  const isAdmin = () => {
    return true;
  };

  const uploadImage = async () => {
    try {
      const formDataImage = new FormData();
      formDataImage.append("image", imageFile!);

      const headers = isAdmin() ? AdminHeaders() : APIHeaders();
      const response = await axios.post(
        `${backendURL}/blog/upload-image`,
        formDataImage,
        { headers: { ...headers, "Content-Type": "multipart/form-data" } }
      );

      console.log("Image uploaded successfully:", response.data);
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        title,
        content,
        metaDescription,
        imageAltText,
        slug: new_slug,
      } = blog;
      let updatedImageUrl = blog.imageUrl;

      if (imageFile) {
        updatedImageUrl = await uploadImage();
      }

      const updatedBlog = {
        title,
        content,
        slug: new_slug,
        metaDescription,
        imageAltText,
        imageUrl: updatedImageUrl,
      };

      const headers = isAdmin() ? AdminHeaders() : APIHeaders();
      const url = `${backendURL}/blog/update-blog/${slug}`;
      await axios.put(url, updatedBlog, { headers });
      // if slug has changed, we need to update the sitemap and all cache for blogs
      if (slug != new_slug) {
        revalidateBlogs();
      } else {
        revalidateUpdatedBlog(slug as string);
      }
      toast.success("Blog updated successfully");
      router.replace(routes.adminBlogs);
    } catch (error: any) {
      const errorMessage =
        error.response?.headers["x-error-message"] ||
        error.response?.data?.error ||
        "Failed to update blog. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden container w-full mx-4 mt-8 mb-4">
        <form onSubmit={handleSubmit} className="px-8 py-6 w-full">
          <h2 className="text-2xl text-yellow-600 font-semibold text-center mb-4">
            Update Blog
          </h2>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Blog Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={blog.title}
              onChange={handleInputChange}
              placeholder="Enter your blog title"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Blog Content
            </label>
            <textarea
              id="content"
              name="content"
              value={blog.content}
              onChange={handleInputChange}
              rows={12}
              placeholder="Write your blog content"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Slug
            </label>
            <textarea
              id="slug"
              name="slug"
              value={blog.slug}
              onChange={handleInputChange}
              placeholder="Write your blog slug"
              className="w-full p-3 border border-gray-300 resize-none h-16 rounded-md shadow-sm focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="metaDescrription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Meta Description
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              value={blog.metaDescription}
              onChange={handleInputChange}
              placeholder="Write your blog meta description"
              className="w-full p-3 border border-gray-300 resize-none h-36 rounded-md shadow-sm focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="imageAltText"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ImageAltText
            </label>
            <textarea
              id="imageAltText"
              name="imageAltText"
              value={blog.imageAltText}
              onChange={handleInputChange}
              placeholder="Write your blog imageALtText"
              className="w-full p-3 border border-gray-300 resize-none h-16 rounded-md shadow-sm focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Image
            </label>
            <input
              id="image"
              type="file"
              name="image"
              onChange={handleImageChange}
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>

          {imageUrlPreview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Preview
              </label>
              <div className="w-full h-40 md:h-64 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={imageUrlPreview}
                  alt="Blog Image Preview"
                  title="Blog Image Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Button
              className="rounded-lg w-32 h-10 mt-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Blog"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBlog;
