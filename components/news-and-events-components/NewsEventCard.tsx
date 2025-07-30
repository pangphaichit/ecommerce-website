import React, { useState, useMemo } from "react";
import { Search, Calendar, FileText } from "lucide-react";
import Select from "@/components/ui/Select";

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  variant?: "user" | "admin" | "default";
}

// Mock Data
const mockData = [
  {
    type: "news",
    category: "Announcement",
    title: "New Office Opening in Bangkok",
    detail:
      "We are excited to announce the opening of our new office in Bangkok to serve our customers better. This expansion is part of our growth strategy in Southeast Asia...",
    image: "/landing-page/bakery-shop.jpg",
    slug: "new-office-opening-bangkok",
    date: "2025-07-25",
  },
  {
    type: "event",
    category: "Event",
    title: "Annual Tech Conference 2025",
    detail:
      "Join us at the Annual Tech Conference 2025 where industry leaders will discuss the future of technology, innovation, and sustainability. The event features keynote speakers, workshops, and networking opportunities.",
    image: "/landing-page/bakery-shop.jpg",
    slug: "annual-tech-conference-2025",
    date: "2025-08-15",
  },
  {
    type: "news",
    category: "Update",
    title: "Product Version 2.0 Released",
    detail:
      "We have officially released Product Version 2.0 with exciting new features, performance improvements, and bug fixes. Update now to experience the best version yet.",
    image: "/landing-page/bakery-shop.jpg",
    slug: "product-version-2-released",
    date: "2025-07-20",
  },
  {
    type: "event",
    category: "Event",
    title: "Webinar: Marketing Trends in 2025",
    detail:
      "Our marketing experts will host a free webinar covering the latest marketing trends, digital tools, and strategies to boost your business in 2025. Register now to secure your spot.",
    image: "/landing-page/bakery-shop.jpg",
    slug: "webinar-marketing-trends-2025",
    date: "2025-08-05",
  },
  {
    type: "news",
    category: "Press Release",
    title: "Partnership with Leading Tech Company",
    detail:
      "We're thrilled to announce our strategic partnership with a leading technology company to enhance our product offerings and expand our market reach.",
    image: "/landing-page/bakery-shop.jpg",
    slug: "partnership-tech-company",
    date: "2025-07-30",
  },
  {
    type: "event",
    category: "Workshop",
    title: "AI Development Workshop",
    detail:
      "Join our hands-on workshop where you'll learn the fundamentals of AI development, machine learning concepts, and practical implementation strategies.",
    image: "/landing-page/bakery-shop.jpg",
    slug: "ai-development-workshop",
    date: "2025-08-10",
  },
];

// Filter options
const contentTypes = [
  { label: "All Types", value: "All" },
  { label: "News", value: "news" },
  { label: "Events", value: "event" },
];

const categories = [
  { label: "All Categories", value: "All" },
  { label: "Announcement", value: "Announcement" },
  { label: "Event", value: "Event" },
  { label: "Update", value: "Update" },
  { label: "Press Release", value: "Press Release" },
  { label: "Workshop", value: "Workshop" },
];

export default function NewsEventComponent() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Search triggered by button or enter key
  const handleSearch = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Memoized filtered data for better performance
  const filteredData = useMemo(() => {
    return mockData
      .filter((item) => {
        const matchesType = filterType === "All" || item.type === filterType;
        const matchesCategory =
          filterCategory === "All" || item.category === filterCategory;
        const matchesSearch =
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.detail.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search, filterType, filterCategory]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setFilterType("All");
    setFilterCategory("All");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">News & Events</h1>
        <p className="text-gray-600">
          Stay updated with our latest news, announcements, and upcoming events.
        </p>
      </div>

      {/* Filters Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        {/* Search Bar */}
        <div className="mb-6">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search news or events..."
              value={search}
              onChange={handleSearchChange}
              onKeyDown={onInputKeyDown}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label
              htmlFor="filterType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content Type
            </label>
            <Select
              name="filterType"
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterType(e.target.value)
              }
              options={contentTypes}
              placeholder="Filter by Type"
              variant="user"
            />
          </div>

          <div>
            <label
              htmlFor="filterCategory"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <Select
              name="filterCategory"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              options={categories}
              placeholder="Filter by Category"
              variant="user"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {mockData.length} results
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No results found</p>
            <p className="text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          filteredData.map((item, idx) => (
            <article
              key={idx}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() =>
                console.log(`Navigate to: /news-events/${item.slug}`)
              }
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.type === "news"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.type === "news" ? (
                      <FileText size={12} className="mr-1" />
                    ) : (
                      <Calendar size={12} className="mr-1" />
                    )}
                    {item.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <time className="text-xs text-gray-500">
                    {formatDate(item.date)}
                  </time>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.detail.length > 120
                    ? item.detail.slice(0, 117) + "..."
                    : item.detail}
                </p>

                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                  Read more
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
