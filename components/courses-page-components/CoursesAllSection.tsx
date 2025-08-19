import { useCallback, useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import CoursesCard from "@/components/courses-page-components/CoursesCard";
import FilterCourses from "@/components/courses-page-components/FilterCourses";
import SkeletonCoursesCard from "@/components/ui/SkeletonCoursesCard";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CourseData {
  course_id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  discounted_price?: number;
  discount_percentage?: number;
  format: "Onsite" | "Video-based";
  difficulty_level: "Beginner" | "Intermediate" | "Advanced";
  duration: {
    total_hours: number;
    lessons: number;
    estimated_completion: string;
  };
  category: number;
  rating: number;
  enrolled_students: number;
  slug: string;
  is_bookable: boolean;
  is_bestseller: boolean;
  created_date: string;
  last_updated: string;
  outcomes: string[];
}

export interface Filters {
  searchQuery: string;
  categories: number[];
  formats: string[];
  difficultyLevels: string[];
  ratings: number;
  durations: string[];
  outcomes: string[];
}

const mockCourses: CourseData[] = [
  {
    course_id: "course_001",
    title: "Baking for Kids",
    description:
      "A fun, hands-on class where children learn essential baking skills while creating cookies, cupcakes, and other delicious treats in a safe, supervised environment. Perfect for young aspiring bakers!",
    image: "/landing-page/baking-course.jpg",
    price: 39.99,
    discounted_price: 35.99,
    discount_percentage: 10,
    format: "Onsite",
    difficulty_level: "Beginner",
    duration: { total_hours: 3, lessons: 5, estimated_completion: "1 day" },
    category: 5,
    slug: "/",
    rating: 4.7,
    enrolled_students: 212,
    is_bookable: true,
    is_bestseller: true,
    created_date: "2025-07-15",
    last_updated: "2025-07-30",
    outcomes: [
      "Learn basic baking techniques for kids",
      "Make cookies, cupcakes, and other fun treats",
      "Understand kitchen safety and hygiene",
      "Build confidence in following recipes",
    ],
  },
  {
    course_id: "course_002",
    title: "Chocolate Chip Cookie Masterclass",
    description:
      "Master the art of baking perfect chocolate chip cookies from scratch in this comprehensive video course. Step-by-step lessons cover mixing techniques, baking secrets, and decorating tips.",
    image: "/courses/chocolate-chip-cookies.jpg",
    price: 0,
    discounted_price: 0,
    discount_percentage: 0,
    format: "Video-based",
    difficulty_level: "Beginner",
    duration: { total_hours: 2, lessons: 4, estimated_completion: "2 days" },
    category: 2,
    slug: "/",
    rating: 4.8,
    enrolled_students: 180,
    is_bookable: true,
    is_bestseller: true,
    created_date: "2025-07-20",
    last_updated: "2025-07-30",
    outcomes: [
      "Bake perfect chocolate chip cookies every time",
      "Master mixing and baking techniques",
      "Learn decorating tips for cookies",
      "Understand recipe adjustments for ingredients",
    ],
  },
  {
    course_id: "course_003",
    title: "Classic Croissant Baking",
    description:
      "Learn the art of creating flaky, buttery croissants from scratch in this comprehensive hands-on course. Master essential techniques including dough preparation, lamination, and professional baking methods.",
    image: "/courses/croissants.jpg",
    price: 49.99,
    format: "Onsite",
    difficulty_level: "Advanced",
    duration: { total_hours: 4, lessons: 3, estimated_completion: "1 day" },
    category: 3,
    slug: "/",
    rating: 4.6,
    enrolled_students: 95,
    is_bookable: true,
    is_bestseller: false,
    created_date: "2025-07-18",
    last_updated: "2025-07-28",
    outcomes: [
      "Create professional-quality croissants",
      "Master dough lamination techniques",
      "Understand fermentation and baking timing",
      "Develop advanced pastry skills",
    ],
  },
  {
    course_id: "course_004",
    title: "Tiramisu Cake",
    description:
      "Discover the secrets of creating authentic Italian tiramisu in this engaging hands-on course. Learn professional layering techniques, mascarpone cream preparation, and elegant presentation methods.",
    image: "/courses/tiramisu-cake.jpg",
    price: 39.99,
    discounted_price: 34.99,
    discount_percentage: 13,
    format: "Onsite",
    difficulty_level: "Intermediate",
    duration: { total_hours: 2.5, lessons: 3, estimated_completion: "1 day" },
    category: 4,
    slug: "tiramisu-fundamentals",
    rating: 4.9,
    enrolled_students: 140,
    is_bookable: true,
    is_bestseller: false,
    created_date: "2025-07-22",
    last_updated: "2025-07-29",
    outcomes: [
      "Prepare authentic Italian tiramisu",
      "Learn professional layering techniques",
      "Master mascarpone cream preparation",
      "Present dessert elegantly",
    ],
  },
  {
    course_id: "course_005",
    title: "Artisan Bread Making",
    description:
      "Discover the traditional art of bread making in this comprehensive course. Learn to create crusty, flavorful loaves using time-honored techniques including proper kneading, fermentation, and shaping methods.",
    image: "/courses/bread.jpg",
    price: 44.99,
    format: "Onsite",
    difficulty_level: "Intermediate",
    duration: { total_hours: 5, lessons: 4, estimated_completion: "1 day" },
    category: 1,
    slug: "/",
    rating: 4.5,
    enrolled_students: 128,
    is_bookable: false,
    is_bestseller: false,
    created_date: "2025-07-12",
    last_updated: "2025-07-25",
    outcomes: [
      "Bake artisan bread with traditional techniques",
      "Master kneading, shaping, and fermentation",
      "Understand crust and crumb development",
      "Create flavorful, bakery-quality loaves at home",
    ],
  },
];

export default function CoursesSection() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("newest");
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  const formatOptions: CourseData["format"][] = ["Onsite", "Video-based"];
  const difficultyOptions: CourseData["difficulty_level"][] = [
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  const [categoriesData] = useState([
    { category_id: 1, name: "Baking", category_slug: "baking" },
    { category_id: 2, name: "Cookies", category_slug: "cookies" },
    { category_id: 3, name: "Croissant", category_slug: "croissant" },
    { category_id: 4, name: "Desserts", category_slug: "desserts" },
    { category_id: 5, name: "Kids", category_slug: "kids" },
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCourses(mockCourses);
      setPagination((prev) => ({
        ...prev,
        total: mockCourses.length,
        totalPages: Math.ceil(mockCourses.length / prev.limit),
      }));
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Sort handler
  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const [filters, setFilters] = useState<Filters>({
    searchQuery: "",
    categories: [],
    formats: [],
    difficultyLevels: [],
    ratings: 0,
    durations: [],
    outcomes: [],
  });

  // Filter change handler
  const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // clear filters function
  const handleClearFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      categories: [],
      formats: [],
      difficultyLevels: [],
      ratings: 0,
      durations: [],
      outcomes: [],
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Pagination handler
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage > 0 && newPage <= pagination.totalPages) {
        setPagination((prev) => ({ ...prev, page: newPage }));
      }
    },
    [pagination.totalPages]
  );

  // check if any filters active
  const isFiltering = useMemo(
    () =>
      filters.searchQuery !== "" ||
      filters.categories.length > 0 ||
      filters.formats.length > 0 ||
      filters.difficultyLevels.length > 0 ||
      filters.ratings > 0 ||
      filters.durations.length > 0,
    [filters]
  );

  // filter and sort courses memoized
  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    // Search
    if (filters.searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          course.description
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase())
      );
    }

    // Category filter - compare number directly
    if (filters.categories.length > 0) {
      filtered = filtered.filter((course) =>
        filters.categories.includes(course.category)
      );
    }

    // Fixed format filter
    if (filters.formats.length > 0) {
      filtered = filtered.filter((course) =>
        filters.formats.includes(course.format)
      );
    }

    // Fixed difficulty level filter
    if (filters.difficultyLevels.length > 0) {
      filtered = filtered.filter((course) =>
        filters.difficultyLevels.includes(course.difficulty_level)
      );
    }

    // Ratings filter
    if (filters.ratings > 0) {
      filtered = filtered.filter((course) => course.rating >= filters.ratings);
    }

    // Duration filter
    if (filters.durations.length > 0) {
      filtered = filtered.filter((course) =>
        filters.durations.some((d) =>
          course.duration.estimated_completion.includes(d)
        )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sort) {
        case "newest":
          return (
            new Date(b.created_date).getTime() -
            new Date(a.created_date).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_date).getTime() -
            new Date(b.created_date).getTime()
          );
        case "best_selling":
          return b.enrolled_students - a.enrolled_students;
        case "price_low": {
          const priceA = a.discounted_price ?? a.price;
          const priceB = b.discounted_price ?? b.price;
          return priceA - priceB;
        }
        case "price_high": {
          const priceA = a.discounted_price ?? a.price;
          const priceB = b.discounted_price ?? b.price;
          return priceB - priceA;
        }
        case "discount_high":
          return (b.discount_percentage ?? 0) - (a.discount_percentage ?? 0);
        case "alphabet_asc":
          return a.title.localeCompare(b.title);
        case "alphabet_desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, filters, sort]);

  // Update pagination total when filteredCourses changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: filteredCourses.length,
      totalPages: Math.ceil(filteredCourses.length / prev.limit),
      page: Math.min(
        prev.page,
        Math.ceil(filteredCourses.length / prev.limit) || 1
      ),
    }));
  }, [filteredCourses]);

  // Get current page courses slice
  const paginatedCourses = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    return filteredCourses.slice(start, start + pagination.limit);
  }, [filteredCourses, pagination]);

  return (
    <div>
      <div className="w-[93%] lg:w-[98%] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row  justify-between items-start lg:items-center lg:mb-2 lg:mx-8 lg:bg-gray-100 lg:rounded-lg lg:shadow-sm lg:p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-yellow-700">
              Our Courses
            </h2>
            <p className="text-base lg:text-lg text-gray-600">
              Learn to bake like a pro with Oven & Wheat.
            </p>
          </div>

          <div className="w-full mt-4 lg:mt-0 lg:w-52">
            <Select
              name="sort"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              options={[
                { label: "Newest First", value: "newest" },
                { label: "Oldest First", value: "oldest" },
                { label: "Best Selling", value: "best_selling" },
                { label: "Price: Low to High", value: "price_low" },
                { label: "Price: High to Low", value: "price_high" },
                { label: "Biggest Discount", value: "discount_high" },
                { label: "A to Z", value: "alphabet_asc" },
                { label: "Z to A", value: "alphabet_desc" },
              ]}
              placeholder="Sort By"
              variant="user"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full min-h-screen lg:mt-8">
          {/* Filters */}
          <div className="lg:w-[20%]">
            <FilterCourses
              categories={categoriesData}
              formats={formatOptions}
              difficultyLevels={difficultyOptions}
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              onClearFilters={handleClearFilters}
              isLoading={isLoading}
            />
          </div>

          {/* Courses list */}
          <div className="flex flex-col w-full lg:w-[80%]">
            {/* Filter status */}
            {isFiltering && (
              <div className="flex flex-row justify-between lg:justify-start gap-2 items-center  my-2 lg:mx-8">
                <button
                  onClick={handleClearFilters}
                  className="flex px-3 py-1 items-center gap-1 mb-4 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  type="button"
                >
                  <p className="text-[0.8rem] lg:text-[0.9rem]">
                    Showing filtered results ( {filteredCourses.length} items )
                  </p>
                  <X size={15} />
                </button>
              </div>
            )}

            {isLoading ? (
              <SkeletonCoursesCard />
            ) : (
              <div className="mb-4 lg:mb-8">
                <CoursesCard
                  courses={paginatedCourses}
                  isFiltering={isFiltering}
                  onClearFilters={handleClearFilters}
                />
                {filteredCourses.length > 0 && pagination.totalPages > 1 && (
                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    showInfo={true}
                    maxVisiblePages={5}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
