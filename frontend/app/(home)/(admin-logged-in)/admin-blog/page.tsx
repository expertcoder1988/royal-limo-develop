"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { AdminHeaders, backendURL } from "@/constants/bankendURL";
import { toast } from "sonner";
import { revalidateBlogs } from "app/actions";


interface Blog {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  slug: string;
  metaDescription: String;
  imageAltText: string;
}

const AllBlogsPage = () => {
  const router = useRouter();
  const pathname = usePathname() || "";
  const localStorage = typeof window !== "undefined" && window.localStorage;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
  });

  const [isAdmin, setIsAdmin] = useState<null | boolean>(null);
  useEffect(() => {
    const isAdmin = Boolean(localStorage && localStorage.getItem("adminToken"));
    if (isAdmin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      toast.error("You are not authorized. Please login as admin.");
      router.push(`/login-admin?from=${encodeURI(pathname)}`);
    } else {
      fetchBlogs();
    }
  }, [isAdmin, pathname]);

  const fetchBlogs = async (page: number = 1, pageSize: number = 9) => {
    try {
      const response = await axios.get(`${backendURL}/blog/blogs`, {
        params: { page, pageSize },
        headers: AdminHeaders(),
      });
      setBlogs(response.data.blogs);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        pageSize: response.data.pagination.pageSize,
        totalCount: response.data.pagination.totalCount,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      toast.error("An error occurred while fetching blogs");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this blog?")) {
        await axios.delete(`${backendURL}/blog/delete-blog/${id}`, {
          headers: AdminHeaders(),
        });
        toast.success("Blog deleted successfully");
        revalidateBlogs();
        setBlogs(blogs.filter((blog) => blog._id !== id));
      }
    } catch (error) {
      toast.error("Error deleting blog");
    }
  };

  const handlePrevPage = () => {
    const prevPage = pagination.currentPage - 1;
    if (prevPage >= 1) {
      fetchBlogs(prevPage, pagination.pageSize);
    }
  };

  const handleNextPage = () => {
    const nextPage = pagination.currentPage + 1;
    if (nextPage <= pagination.totalPages) {
      fetchBlogs(nextPage, pagination.pageSize);
    }
  };

  return (
    <div className="container mx-auto shadow-lg ">
      <h1 className="text-2xl lg:text-4xl font-semibold mt-2 ml-10 pt-10 mb-9">
        All Blogs
      </h1>
      {isAdmin && (
        <Button className="rounded-lg w-auto h-10 mt-2 ml-10 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <Link href={routes.createBlogs}>Create New Blog</Link>
        </Button>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
        {blogs.map((blog) => (
          <div
            key={blog.slug}
            className="flex flex-col bg-white shadow-xl rounded-lg overflow-hidden"
          >
            <div className="m-5">
              <img 
                src={`${backendURL.replace("/api", "")}${blog.imageUrl}`}
                alt={blog.title}
                title={blog.title}
                className="h-60 w-full object-cover rounded-lg"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-bold mb-5 h-16">
                <Link href={`${routes.blogDetail.replace(":slug", blog.slug)}`}>
                  {blog.title.substring(0, 60)}
                </Link>
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4 h-[74px]">
                {blog.content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 150)}
                ...
              </p>
              <div className="flex justify-between">
                <Button className="rounded-lg w-32 h-10 mr-2">
                  <Link
                    href={`${routes.blogUpdate.replace(":slug", blog.slug)}`}
                  >
                    Update Blog
                  </Link>
                </Button>
                <Button
                  className="rounded-lg w-32 h-10 mr-2"
                  onClick={() => handleDelete(blog._id)}
                >
                  Delete Blog
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 pr-5">
        <Button
          className="rounded-lg w-12 h-9 mt-0 "
          onClick={handlePrevPage}
          disabled={pagination.currentPage === 1}
        >
          Prev
        </Button>
        <Button
          className="rounded-lg w-12 h-9 mt-0"
          onClick={handleNextPage}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AllBlogsPage;
