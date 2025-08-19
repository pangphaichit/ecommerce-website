import React, { useState, useMemo } from "react";
import {
  Calendar,
  FileText,
  ChefHat,
  ChevronRight,
  Search,
  X,
  Sparkles,
  BookHeart,
  Users,
  Gift,
} from "lucide-react";
import { format } from "date-fns";
import Button from "@/components/ui/Button";
import SkeletonNewsEventGrid from "@/components/ui/SkeletonNewsEventGrid";

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  variant?: "user" | "admin" | "default";
}

// Mock Data for Oven & Wheat Bakery
const mockData = [
  {
    badge: "event",
    Highlight: "Milestone Celebration",
    categories: ["heritage", "events"],
    title: "One Year Anniversary in USA",
    detail:
      "Celebrating our first year in America! Join us for a week-long celebration featuring daily specials, the story of our journey from England to San Francisco, special guest appearances, and a grand celebration party. Thank you for welcoming us to this amazing city!",
    image: "/news-and-events/one-year-anniversary.jpg",
    slug: "usa-anniversary-celebration",
    date: "2025-08-20",
  },
  {
    badge: "news",
    Highlight: "Kids Baking Class",
    categories: ["courses"],
    title: "Little Bakers Academy - Fun Baking for Kids",
    detail:
      "A delightful baking experience designed for children ages 6-12! Kids will learn basic baking skills through fun activities, create their own mini loaves, and discover the joy of baking. All materials included, plus take-home treats and a junior baker's certificate.",
    image: "/landing-page/baking-class.jpg",
    slug: "kids-baking-class",
    date: "2025-08-15",
  },
  {
    badge: "news",
    categories: ["courses"],
    Highlight: "Japanese Baking",
    title: "Shio Pan - Japanese Salt Bread Workshop",
    detail:
      "Learn to create authentic Japanese Shio Pan (salt bread) with Elena's signature twist. This hands-on course covers traditional Japanese techniques, perfect salt balance, and the fluffy texture that makes this bread irresistible. Includes recipe book and take-home starter kit.",
    image: "/landing-page/baking-course.jpg",
    slug: "shio-pan-workshop",
    date: "2025-08-10",
  },
  {
    badge: "event",
    Highlight: "Community Event",
    categories: ["courses", "events"],
    title: "Oven & Wheat at San Francisco Flea Market",
    detail:
      "Join us at the iconic San Francisco Flea Market! We'll be bringing our freshly baked goods, offering samples of our signature breads, and sharing stories of our journey from English village to the Bay Area. Special market prices on select items!",
    image: "/news-and-events/flea-market.jpg",
    slug: "sf-flea-market-event",
    date: "2025-08-05",
  },
  {
    badge: "event",
    Highlight: "Community Impact",
    categories: ["community", "events"],
    title: "Supporting Local Food Banks",
    detail:
      "Every month, we donate 10% of our profits and fresh bread to local food banks in San Francisco. This month, we've provided over 500 loaves to families in need, continuing Margaret's legacy of community care and Elena's commitment to giving back to our new home.",
    image: "/news-and-events/charity.jpg",
    slug: "monthly-charity-initiative",
    date: "2025-07-30",
  },
  {
    badge: "news",
    Highlight: "Expansion News",
    categories: ["heritage"],
    title: "New Branch Opening in Castro District",
    detail:
      "We're thrilled to announce the opening of our second San Francisco location in the vibrant Castro District! This new branch will feature our full range of artisan breads, pastries, and a dedicated space for our popular baking workshops. Grand opening celebration coming soon!",
    image: "/about-us/shop-window.jpg",
    slug: "castro-branch-opening",
    date: "2025-07-28",
  },
  {
    badge: "news",
    Highlight: "New Product Launch",
    categories: ["products"],
    title: "Macaron à la Rose",
    detail:
      "Introducing our exquisite Macaron à la Rose, crafted with organic rose petals and premium almond flour. Elena's refined technique creates the perfect balance of delicate rose flavor and classic French macaron texture. Available for a limited time at our San Francisco location.",
    image: "/landing-page/macarons.jpg",
    slug: "macaron-a-la-rose",
    date: "2025-07-25",
  },
  {
    badge: "news",
    Highlight: "New Service Launch",
    categories: ["products"],
    title: "Custom Party Catering",
    detail:
      "Now offering custom party catering services! From birthday celebrations to corporate events, we'll create personalized bread baskets, custom cakes, and artisan pastry platters. Elena personally designs each menu to match your event's theme and dietary requirements.",
    image: "/news-and-events/custom-party.jpg",
    slug: "custom-party-catering",
    date: "2025-07-22",
  },
];

const categories = [
  { label: "All", value: "All", icon: Sparkles },
  { label: "Heritage & Stories", value: "heritage", icon: BookHeart },
  { label: "Courses", value: "courses", icon: ChefHat },
  { label: "Community", value: "community", icon: Users },
  { label: "Events", value: "events", icon: Calendar },
  { label: "Product and Services News", value: "products", icon: Gift },
];

export default function NewsEventCard() {
  // States
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedType, setAppliedType] = useState("All");
  const [appliedCategory, setAppliedCategory] = useState<string | "All">("All");

  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    setIsLoading(true);
    setAppliedSearch(search.trim());
    setAppliedType(filterType);
    setAppliedCategory(filterCategory);
    setTimeout(() => setIsLoading(false), 500);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilterType("All");
    setFilterCategory("All");
    setAppliedSearch("");
    setAppliedType("All");
    setAppliedCategory("All");
  };

  // Filtering the data
  const filteredData = useMemo(() => {
    return mockData
      .filter((item) => {
        const matchesType = appliedType === "All" || item.badge === appliedType;

        const matchesCategory =
          appliedCategory === "All" ||
          (item.categories &&
            item.categories.includes(appliedCategory as string));

        const searchLower = appliedSearch.toLowerCase();
        const matchesSearch =
          item.title.toLowerCase().includes(searchLower) ||
          item.detail.toLowerCase().includes(searchLower);

        return matchesType && matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appliedSearch, appliedType, appliedCategory]);

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "MMM dd, yyyy");

  const getTypeIcon = (badge: string) => {
    switch (badge) {
      case "courses":
      case "course":
        return <ChefHat size={12} className="mr-1" />;
      case "event":
        return <Calendar size={12} className="mr-1" />;
      case "news":
      default:
        return <FileText size={12} className="mr-1" />;
    }
  };

  const getTypeColors = (badge: string) => {
    switch (badge) {
      case "courses":
      case "course":
        return "bg-amber-100 text-amber-800";
      case "event":
        return "bg-green-100 text-green-800";
      case "news":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="w-full max-w-[93%] lg:max-w-[95%] mx-auto">
      <div className="mb-6 text-center flex flex-col max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-semibold mb-4 text-yellow-700">
          News and Events
        </h1>
        <p className="text-base lg:text-lg text-gray-600">
          Stay fresh with the latest from our bakery family - new flavors,
          workshops, community events, and the stories behind every bake
        </p>
      </div>

      {/* Toggle button for mobile */}
      <div className="lg:hidden mb-4">
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
        <div className="bg-white lg:bg-gray-100 lg:rounded-lg lg:shadow-sm lg:p-8 mb-4 lg:mb-10">
          <div>
            <label
              htmlFor="search"
              className="block text-base lg:text-lg font-semibold text-yellow-700 mb-2"
            >
              Find news and events
            </label>
            <div className="flex flex-col lg:flex-row items-stretch gap-4">
              <div className="flex items-center focus-within:border-yellow-600 w-full relative">
                <input
                  id="search"
                  type="text"
                  placeholder="What are you looking for?"
                  value={search}
                  onChange={handleSearchChange}
                  onKeyDown={onInputKeyDown}
                  className="w-full px-2 py-2 bg-white focus:outline-none text-yellow-600 border-b-2 border-gray-300 focus:border-yellow-600 placeholder-gray-400"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      clearFilters();
                    }}
                    className="absolute right-2 top-1/2 lg:right-20 -translate-y-1/2 p-1 bg-gray-300 hover:bg-gray-400 text-white rounded-full cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="hidden lg:flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-r-md ml-4 cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-base">
                    <Search size={20} />
                  </div>
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-[600px] flex flex-wrap gap-3 mt-6 mb-6 lg:mb-0 justify-center max-w-4xl mx-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.value}
                    variant={
                      filterCategory === category.value ? "default" : "outline"
                    }
                    className="rounded-4xl text-sm lg:text-base flex items-center gap-1.5"
                    onClick={() => {
                      setFilterCategory(category.value);
                      setAppliedCategory(category.value);
                    }}
                  >
                    <Icon size={16} />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Result Info */}
      {(appliedSearch ||
        appliedCategory !== "All" ||
        appliedType !== "All") && (
        <div className="flex flex-row gap-2">
          <button
            onClick={clearFilters}
            className="flex px-3 py-1 items-center gap-1 mb-4 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
            type="button"
          >
            <p className="text-[0.8rem] lg:text-[0.9rem]">
              Showing {filteredData.length} filtered result(s)
            </p>
            <X size={15} />
          </button>
        </div>
      )}

      {/* Result Grid */}
      {isLoading ? (
        <SkeletonNewsEventGrid />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-10">
          {filteredData.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <ChefHat size={65} className="mx-auto mb-4 text-yellow-600" />
              <p className="text-lg font-medium mb-2">No results found</p>
              <p>Try different keywords or browse all our latest updates!</p>
            </div>
          ) : (
            filteredData.map((item, idx) => (
              <article
                key={idx}
                className="relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 group overflow-hidden cursor-pointer"
                onClick={() =>
                  console.log(`Navigate to /news-events/${item.slug}`)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log(`Navigate to /news-events/${item.slug}`);
                  }
                }}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex items-center px-2 py-1.25 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm ${getTypeColors(
                        item.badge
                      )} border border-white/20`}
                    >
                      {getTypeIcon(item.badge)}
                      {item.badge === "course"
                        ? "COURSE"
                        : item.badge.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="px-6 pt-6 pb-9 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.65rem] font-semibold text-gray-500 bg-gray-100 py-1.5 px-2 uppercase tracking-wide rounded-md">
                      {item.Highlight}
                    </span>
                    <time className="text-xs text-gray-500 font-medium rounded-md">
                      {formatDate(item.date)}
                    </time>
                  </div>
                  <h3 className="text-lg font-bold text-yellow-700 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed line-clamp-3">
                    {item.detail.length > 120
                      ? item.detail.slice(0, 117) + "..."
                      : item.detail}
                  </p>
                  <div className="absolute bottom-4 left-6">
                    <div className="flex flex-row">
                      <span className="flex hover:text-yellow-700 text-yellow-600 text-base font-medium hover:font-semibold cursor-pointer">
                        Read more
                        <ChevronRight size={25} />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}
