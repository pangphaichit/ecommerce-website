import React from "react";
import Image from "next/image";

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
        <div
          key={blog.blog_id}
          className={`flex flex-col md:flex-row gap-6 rounded-lg hover:shadow-lg  ${
            index % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="md:w-1/3 flex-shrink-0">
            <Image
              src={blog.image_url}
              alt={blog.title}
              className="object-cover rounded-lg w-full h-full"
              width={400}
              height={300}
            />
          </div>
          <div className="md:w-2/3 flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
            <p className="text-gray-600">
              {blog.article.length > 500
                ? blog.article.slice(0, 500) + "..."
                : blog.article}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
