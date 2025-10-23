import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChevronRight, Clock, Eye, Heart, Share2 } from "lucide-react";

interface Blog {
  blog_id: number;
  title: string;
  article: string;
  image_url: string;
  create_at: string;
  update_at: string;
  slug: string;
  category_name: string;
  author_name: string;
  author_role: string;
  avatar: string;
  likes: number;
  shares: number;
  total_reads: number;
  read_minutes: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Filters {
  searchQuery: string;
  category: string;
  authorRole: string;
}

interface BlogListProps {
  blogs: Blog[];
  isFiltering?: boolean;
}

export default function BlogList({ blogs, isFiltering }: BlogListProps) {
  const router = useRouter();

  const handleBlogClick = (slug: string) => {
    router.push(`/blogs/${slug}`);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (blogs.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        {isFiltering ? "No blogs match your filters." : "No blogs available."}
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 my-6">
      {blogs.map((blog, index) => (
        <div className=" bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 group overflow-hidden cursor-pointer">
          <div
            key={blog.blog_id}
            className="flex flex-col h-130 gap-4"
            onClick={() => handleBlogClick(blog.slug)}
          >
            <div className="w-[1/2]">
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={blog.image_url}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="px-4">
              <div className="flex justify-start w-100">
                <span className="text-sm font-medium text-yellow-800 bg-gray-100 px-3 py-1 rounded-full  inline-block">
                  {blog.category_name}
                </span>
              </div>
              <div className="relative w-full flex flex-col justify-start mt-4">
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-yellow-700">
                    {blog.title}
                  </h3>
                </div>

                <p className="text-gray-600 text-lg my-4">
                  {blog.article.length > 250
                    ? blog.article.slice(0, 250) + "..."
                    : blog.article}
                </p>
              </div>
            </div>
          </div>
          <div className="px-4">
            <div className="flex gap-3 items-center  my-4">
              {/* Author Avatar */}
              <Image
                src={blog.avatar}
                alt={blog.author_name}
                width={48}
                height={48}
                className="rounded-full object-cover w-12 h-12 lg:w-10 lg:h-10"
              />

              {/* Author Info */}
              <div className="flex flex-row gap-2 justify-center">
                <span className="font-semibold text-gray-900 text-sm ">
                  {blog.author_name}
                </span>

                <span className="text-gray-500 text-sm border-r-2 border-gray-300 pr-2 ">
                  {blog.author_role
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>

                <span className="text-gray-400 text-sm">
                  {formatDate(blog.update_at)}
                </span>
              </div>
            </div>
            {/* Stats Bar */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{blog.read_minutes} min read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{blog.total_reads}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                <span>{blog.likes}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Share2 className="w-4 h-4" />
                <span>{blog.shares}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <button className="flex flex-row">
                  <span className="flex hover:text-yellow-700 text-yellow-600 text-lg font-medium hover:font-semibold cursor-pointer my-4">
                    Read more
                    <ChevronRight size={28} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
