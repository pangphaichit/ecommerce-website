import React from "react";
import Image from "next/image";
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
    <div className="grid gap-6 grid-cols-1 my-6">
      {blogs.map((blog, index) => (
        <div>
          <div
            key={blog.blog_id}
            className="flex flex-col lg:flex-row gap-6 rounded-lg"
          >
            <div className="lg:w-2/4">
              <div className="relative w-full h-full  overflow-hidden rounded-lg">
                <Image
                  src={blog.image_url}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative lg:w-2/4 flex flex-col justify-start">
              <div className="flex flex-col">
                <h3 className="text-2xl font-semibold mb-2 text-yellow-700">
                  {blog.title}
                </h3>
                <span className="text-base font-medium text-yellow-600 mb-1 inline-block">
                  {blog.category_name}
                </span>
              </div>
              <p className="text-gray-600 text-lg">
                {blog.article.length > 500
                  ? blog.article.slice(0, 500) + "..."
                  : blog.article}
              </p>
              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
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
                <div className="flex gap-4 items-center  mt-4">
                  {/* Author Avatar */}
                  <Image
                    src={blog.avatar}
                    alt={blog.author_name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-12 h-12 lg:w-14 lg:h-14"
                  />

                  {/* Author Info */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {blog.author_name}
                    </span>

                    <span className="text-gray-500 text-sm">
                      {blog.author_role
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>

                    <span className="text-gray-400 text-xs">
                      {formatDate(blog.update_at)}
                    </span>
                  </div>
                </div>

                <div>
                  <button className="flex flex-row">
                    <span className="flex hover:text-yellow-700 text-yellow-600 text-lg font-medium hover:font-semibold cursor-pointer">
                      Read more
                      <ChevronRight size={28} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
