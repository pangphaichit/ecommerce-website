import React from "react";
import { useState, useCallback } from "react";
import Select from "@/components/ui/Select";
import { ChefHat, Sparkles, User, Palette, X, Search } from "lucide-react";
import BlogTabs from "@/components/blogs-page-components/BlogTabs";
import Button from "@/components/ui/Button";

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

interface BlogFilterSidebarProps {
  blogs: Blog[];
  isFiltering?: boolean;
}

const authorRoles = [
  { label: "All Authors", value: "All", icon: Sparkles },
  { label: "Owner", value: "owner", icon: User },
  { label: "Pastry Chef", value: "pastry_chef", icon: ChefHat },
  { label: "Cake Designer", value: "cake_designer", icon: Palette },
];

export default function BlogFilterSidebar({
  blogs,
  isFiltering,
}: BlogFilterSidebarProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>("newest");
  const [filterCategory, setFilterCategory] = useState("All");
  const [appliedCategory, setAppliedCategory] = useState<string | "All">("All");
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  // Sort handler
  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className=" mt-8 bg-gray-100 p-4 lg:rounded-2xl">
        <div className="flex flex-col lg:flex-row  justify-between items-start lg:items-center lg:mb-2">
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-yellow-700">
              Our Blog
            </h2>
            <p className="text-base lg:text-lg text-gray-600">
              Tips, recipes, and behind-the-scenes from our team.
            </p>
          </div>
        </div>
        <BlogTabs />

        <div className="w-full lg:w-[650px] flex flex-wrap gap-3 mt-4 mb-6 lg:mb-0 justify-center max-w-4xl mx-auto">
          {authorRoles.map((role) => {
            const Icon = role.icon;
            return (
              <Button
                key={role.value}
                variant={filterCategory === role.value ? "default" : "outline"}
                className="rounded-4xl text-sm lg:text-base flex items-center gap-1.5"
                onClick={() => {
                  setFilterCategory(role.value);
                  setAppliedCategory(role.value);
                }}
              >
                <Icon size={16} />
                {role.label}
              </Button>
            );
          })}
        </div>
        <div className="flex justify-between items-center gap-4 mt-8">
          <input
            id="search"
            type="text"
            placeholder="What are you looking for?"
            value={search}
            className="w-full px-2 py-2  focus:outline-none text-yellow-600 border-b-2 border-gray-300 focus:border-yellow-600 placeholder-gray-400 bg-white"
          />
          <Button className="hidden lg:flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-r-md  cursor-pointer">
            <div className="flex items-center gap-2 text-base">
              <Search size={20} />
            </div>
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between mt-6">
        <div className="flex flex-row gap-2">
          <button
            className="flex px-3 py-1 items-center gap-1 mb-4 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
            type="button"
          >
            <p className="text-[0.8rem] lg:text-[0.9rem]">
              Showing {blogs.length} filtered result(s)
            </p>
            <X size={15} />
          </button>
        </div>
        <div className="w-[30%]">
          <Select
            name="sort"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            options={[
              { label: "Newest First", value: "newest" },
              { label: "Oldest First", value: "oldest" },
              { label: "Most Liked", value: "most_liked" },
              { label: "Most Read", value: "most_read" },
              { label: "A to Z", value: "alphabet_asc" },
              { label: "Z to A", value: "alphabet_desc" },
            ]}
            placeholder="Sort By"
            variant="user"
          />
        </div>
      </div>
    </div>
  );
}
