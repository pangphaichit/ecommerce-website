import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "@/components/ui/Select";
import {
  ChefHat,
  Sparkles,
  User,
  Palette,
  X,
  Search,
  BookHeart,
  Clapperboard,
} from "lucide-react";
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

interface BlogFilterSidebarProps {
  blogs: Blog[];
  isFiltering?: boolean;
  searchQuery: string;
  sort: string;
  category: string;
  authorRole: string;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  onCategoryChange: (category: string) => void;
  onAuthorRoleChange: (role: string) => void;
  onClearFilters: () => void;
  totalResults: number;
}

const authorRoles = [
  { label: "All Authors", value: "All", icon: Sparkles },
  { label: "Owner", value: "owner", icon: User },
  { label: "Pastry Chef", value: "pastry chef", icon: ChefHat },
  { label: "Cake Designer", value: "cake designer", icon: Palette },
];

export default function BlogFilterSidebar({
  blogs,
  isFiltering,
  searchQuery,
  sort,
  category,
  authorRole,
  onSearchChange,
  onSortChange,
  onCategoryChange,
  onAuthorRoleChange,
  onClearFilters,
  totalResults,
}: BlogFilterSidebarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([
    { label: "All", value: "all", icon: Sparkles },
  ]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/blogs/categories");
        const data = res.data.categories;
        console.log("Fetched categories:", data);

        const mappedCategories = data.map(
          (cat: { id: number; name: string }) => {
            let icon;
            switch (cat.name.toLowerCase()) {
              case "recipes":
                icon = BookHeart;
                break;
              case "tips & tricks":
                icon = ChefHat;
                break;
              case "behind the scenes":
                icon = Clapperboard;
                break;
              default:
                icon = Sparkles;
            }

            return {
              label: capitalize(cat.name),
              value: cat.id,
              icon,
            };
          }
        );

        setCategories((prev) => [
          ...prev.filter((c) => c.value === "all"),
          ...mappedCategories,
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchSubmit = () => {
    onSearchChange(localSearch);
  };

  return (
    <div>
      {/* Header */}
      <div className=" lg:mt-8 lg:bg-gray-100 my-4 lg:p-4 lg:rounded-2xl">
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
        {/* Toggle button for mobile */}
        <div className="lg:hidden mt-4">
          <Button
            variant={showFilters ? "lightyellow" : "yellow"}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded w-full ${
              showFilters ? "text-yellow-600" : "text-white"
            }`}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filters */}
        <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
          <BlogTabs
            categories={categories}
            selectedCategory={category}
            onCategoryChange={(id) => onCategoryChange(id)}
          />

          <div className="w-full lg:w-[650px] flex flex-wrap gap-3 mt-4 mb-6 lg:mb-0 justify-center max-w-4xl mx-auto">
            {authorRoles.map((role) => {
              const Icon = role.icon;
              const isSelected =
                authorRole === role.value ||
                (!authorRole && role.value === "All");
              return (
                <Button
                  key={role.value}
                  variant={isSelected ? "default" : "outline"}
                  className="rounded-4xl text-sm lg:text-base flex items-center gap-1.5"
                  onClick={() => onAuthorRoleChange(role.value)}
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
              placeholder="Search recipes, tips, or stories..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="w-full px-2 py-2  focus:outline-none text-yellow-600 border-b-2 border-gray-300 focus:border-yellow-600 placeholder-gray-400 bg-white"
            />
            <Button
              onClick={handleSearchSubmit}
              className="hidden lg:flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-r-md  cursor-pointer"
            >
              <div className="flex items-center gap-2 text-base">
                <Search size={20} />
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row  items-start lg:items-center justify-between mt-2 lg:mt-6">
        <div className="flex flex-row gap-2">
          {isFiltering && (
            <button
              className="flex px-3 py-1 items-center gap-1 mb-4 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
              type="button"
              onClick={onClearFilters}
            >
              <p className="text-[0.8rem] lg:text-[0.9rem]">
                Showing {totalResults} filtered result(s)
              </p>
              <X size={15} />
            </button>
          )}
        </div>
        <div className="w-full lg:w-[30%]">
          <Select
            name="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
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
