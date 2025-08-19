import Image from "next/image";
import { useRouter } from "next/router";
import { BookMarked, Clock, Album, Baby, Globe, Bookmark } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

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
}

interface CoursesCardProps {
  courses: CourseData[];
  isFiltering?: boolean;
  onClearFilters?: () => void;
  onBookmark?: (courseId: string) => void;
  bookmarkedCourses?: string[];
}

export default function CoursesCard({
  courses,
  isFiltering = false,
  onClearFilters,
  onBookmark,
  bookmarkedCourses = [],
}: CoursesCardProps) {
  const router = useRouter();

  const handleCourseClick = (slug: string) => {
    router.push(`/courses/${slug}`);
  };

  const handleBookmark = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(courseId);
    } else {
      alert(`Bookmark functionality not implemented`);
    }
  };

  const validCourses = courses.filter(Boolean);

  if (validCourses.length === 0) {
    return (
      <div className="w-full lg:max-w-[95%] mx-auto">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookMarked size={65} className="mx-auto mb-4 text-yellow-600" />
          <h3 className="text-lg lg:text-2xl font-medium text-gray-500 mb-2">
            No Courses Found
          </h3>
          <p className="text-base lg:text-lg text-gray-400 mb-6">
            {isFiltering
              ? "No courses match your current filters. Try adjusting your search."
              : "No courses are available right now. Please check back later!"}
          </p>
          {isFiltering && onClearFilters && (
            <Button variant="yellow" onClick={onClearFilters} className="px-6">
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:max-w-[95%] mx-auto grid gap-4 grid-cols-1 lg:grid-cols-3">
      {validCourses.map((course) => {
        const isBookable = course.is_bookable;
        const coursePrice = course.discounted_price ?? course.price;
        const hasDiscount =
          typeof course.discounted_price === "number" &&
          course.discounted_price > 0 &&
          course.discounted_price < course.price;

        const isBookmarked = bookmarkedCourses.includes(course.course_id);

        return (
          <div
            key={course.course_id}
            className="flex flex-col group border border-gray-200 rounded-xl overflow-hidden relative cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => handleCourseClick(course.slug)}
            role="article"
            aria-label={`Course: ${course.title}`}
          >
            {/* Image Section */}
            <div className="relative w-full h-52 bg-gray-100">
              {course.is_bestseller && (
                <div className="absolute top-2 left-2 z-20">
                  <Badge
                    variant="warning"
                    className="text-sm fonmt-semibold py-1"
                  >
                    BEST SELLER
                  </Badge>
                </div>
              )}

              {!isBookable && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gray-500 bg-opacity-30" />
                  <Badge
                    variant="destructive"
                    className="text-sm z-30 flex items-center justify-center"
                  >
                    Fully Booked
                  </Badge>
                </div>
              )}

              <Image
                src={`${course.image}?t=${Date.now()}`}
                alt={course.title}
                className={`relative h-full w-full object-cover transition-all duration-200 ${
                  !isBookable ? "grayscale opacity-50" : ""
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                width={400}
                height={300}
              />
            </div>

            {/* Tags and Bookmark Section */}
            <div className="flex justify-between">
              <div className="flex flex-wrap gap-2 mx-4 mt-4 text-xs font-medium">
                <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-2.5 py-1.5 rounded-full">
                  <Clock size={14} />
                  <span>{course.duration.total_hours}h</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${
                    course.difficulty_level === "Beginner"
                      ? "bg-yellow-50 text-yellow-500"
                      : course.difficulty_level === "Intermediate"
                      ? "bg-slate-50 text-gray-500"
                      : "bg-purple-50 text-purple-500"
                  }`}
                >
                  <Album size={14} />
                  <span>{course.difficulty_level}</span>
                </div>
                {course.category === 5 && (
                  <div className="flex items-center gap-1.5 bg-pink-50 text-pink-600 px-2.5 py-1.5 rounded-full">
                    <Baby size={14} />
                    <span>Kids</span>
                  </div>
                )}
                {course.format === "Video-based" && (
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-full">
                    <Globe size={14} />
                    <span>Online</span>
                  </div>
                )}
              </div>
              <button
                className="mx-4 mt-4 p-1 rounded-full cursor-pointer "
                onClick={(e) => handleBookmark(e, course.course_id)}
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Bookmark
                  className="text-yellow-500 transition-colors duration-200 hover:fill-yellow-500 hover:text-yellow-500"
                  fill="none"
                />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-[0.95rem] text-yellow-600 truncate">
                {course.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600 flex-1 line-clamp-3">
                {course.description.length > 120
                  ? course.description.slice(0, 120) + "..."
                  : course.description}
              </p>

              {/* Price and Button */}
              <div className="mt-4">
                {hasDiscount ? (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-red-600">
                      ${course.discounted_price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${course.price}
                    </span>
                  </div>
                ) : null}
                <Button
                  className="w-full text-base font-semibold p-4"
                  disabled={!isBookable}
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Add ${course.title} to cart for $${coursePrice}!`);
                  }}
                >
                  {course.price === 0
                    ? "Enroll for Free"
                    : hasDiscount
                    ? `Buy for $${coursePrice}`
                    : `Buy for $${course.price}`}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
