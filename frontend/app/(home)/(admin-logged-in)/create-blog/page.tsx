"use client";
import { Button } from "@/components/ui/button";
import { AdminHeaders, backendURL } from "@/constants/bankendURL";
import { routes } from "@/constants/routes";
import { compressFile } from "@/helpers/image-compression";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { revalidateBlogs } from "../../../actions";
import React from "react";

const CreateBlogsForm = () => {
  const localStorage = typeof window !== "undefined" && window.localStorage;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [imageAltText, setImageAltText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname() || "";
  useEffect(() => {
    const isAdmin = Boolean(localStorage && localStorage.getItem("adminToken"));
    if (!isAdmin) {
      toast.error("You are not authorized. Please login as admin.");
      router.push(`/login-admin?from=${encodeURI(pathname)}`);
    }
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title") setTitle(value);
    if (name === "content") setContent(value);
    if (name === "slug") setSlug(value);
    if (name === "metaDescription") setMetaDescription(value);
    if (name === "imageAltText") setImageAltText(value);

    if (
      name === "image" &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !title ||
      !content ||
      !imageFile ||
      !slug ||
      !metaDescription ||
      !imageAltText
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const headers = AdminHeaders();

      let uploadedImageUrl = imageUrl;
      if (imageFile) {
        const formDataImage = new FormData();
        const compressedImage = await compressFile(imageFile);
        formDataImage.append("image", compressedImage);

        const responseImage = await axios.post(
          `${backendURL}/blog/upload-image`,
          formDataImage,
          { headers: { ...headers, "Content-Type": "multipart/form-data" } }
        );

        uploadedImageUrl = responseImage.data.imageUrl;
      }

      const formDataBlog = {
        title,
        content,
        imageUrl: uploadedImageUrl || "",
        slug,
        metaDescription,
        imageAltText,
      };
      console.log("Payload being sent:", formDataBlog);
      await axios.post(`${backendURL}/blog/blog`, formDataBlog, { headers });
      toast.success("Blog created successfully");
      revalidateBlogs();
      router.replace(routes.adminBlogs);
    } catch (error: any) {
      const errorMessage =
        error.response?.headers["x-error-message"] ||
        error.response?.data?.error ||
        "Error creating blog. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden container w-full mx-4 mt-8 mb-4">
        <form onSubmit={handleSubmit} className="px-8 py-6">
          <h2 className="text-2xl text-yellow-600 font-semibold text-center mb-4">
            Create a New Blog
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
              value={title}
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
              value={content}
              rows={12}
              onChange={handleInputChange}
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
              value={slug}
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
              value={metaDescription}
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
              value={imageAltText}
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
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>

          {imageUrl && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Preview
              </label>
              <div className="w-full h-40 md:h-64 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={imageUrl}
                  alt="Preview"
                  title="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              className="rounded-lg w-32 h-10 mt-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Blog"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogsForm;
