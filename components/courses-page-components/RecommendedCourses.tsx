import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight, BookMarked } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface CourseOutcome {
  id: number;
  outcome: string;
}

interface RecommendedCourseData {
  course_id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  discounted_price?: number;
  format: "Onsite" | "Video-based";
  difficulty_level: "Beginner" | "Intermediate" | "Advanced";
  duration: {
    total_hours: number;
    lessons: number;
    estimated_completion: string;
  };
  rating: number;
  enrolled_students: number;
  slug: string;
  is_bookable: boolean;
  is_bestseller: boolean;
  outcomes: CourseOutcome[];
}

interface RecommendedCoursesProps {
  courses: RecommendedCourseData[];
  title?: string;
  onCourseClick?: (slug: string) => void;
}

export default function RecommendedCourses({
  courses,
  title = "Recommended Courses",
  onCourseClick,
}: RecommendedCoursesProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? courses.length : 1);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [courses.length]);

  const handleCourseClick = (slug: string) => {
    if (onCourseClick) {
      onCourseClick(slug);
    } else {
      router.push(`/courses/${slug}`);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : courses.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < courses.length - 1 ? prev + 1 : 0));
  };

  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const displayedCourses =
    itemsPerPage === 1 ? [courses[currentIndex]] : courses;

  if (courses.length === 0) {
    return (
      <div className="w-full lg:max-w-[95%] mx-auto">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookMarked size={65} className="mx-auto mb-4 text-yellow-600" />
          <h3 className="text-lg lg:text-2xl font-medium text-gray-500 mb-2">
            No Recommended Courses
          </h3>
          <p className="text-base lg:text-lg text-gray-400">
            No recommended courses are available right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Title */}
      <h2 className="text-xl lg:text-2xl font-bold text-yellow-600  mb-6 text-center">
        - {title} -
      </h2>

      {/* Course Cards Container */}
      <div className="relative">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
          {displayedCourses.map((course) => {
            const isBookable = course.is_bookable;
            const coursePrice = course.discounted_price ?? course.price;
            const hasDiscount =
              typeof course.discounted_price === "number" &&
              course.discounted_price > 0 &&
              course.discounted_price < course.price;

            return (
              <div
                key={course.course_id}
                className="flex flex-col group border border-gray-200 rounded-xl overflow-hidden relative cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => handleCourseClick(course.slug)}
                role="article"
                aria-label={`Recommended Course: ${course.title}`}
              >
                {/* Image Section */}
                <div className="relative w-full h-52 bg-gray-100">
                  {course.is_bestseller && (
                    <div className="absolute top-2 left-2 z-20">
                      <Badge
                        variant="warning"
                        className="text-sm font-semibold py-1"
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

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="font-bold text-[0.95rem] text-yellow-600 mb-2">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description.length > 100
                      ? course.description.slice(0, 100) + "..."
                      : course.description}
                  </p>

                  {/* Outcomes */}
                  <div className="mb-4 flex-1">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      What You'll Learn:
                    </h4>
                    <ul className="space-y-1">
                      {course.outcomes.slice(0, 3).map((outcome) => (
                        <li
                          key={outcome.id}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check
                            size={16}
                            className="text-green-500 mt-0.5 flex-shrink-0"
                          />
                          <span className="line-clamp-1">
                            {outcome.outcome}
                          </span>
                        </li>
                      ))}
                      {course.outcomes.length > 3 && (
                        <li className="text-sm text-gray-500 ml-6">
                          +{course.outcomes.length - 3} more outcomes
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Price Section */}
                  <div className="mb-3">
                    {hasDiscount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-red-600">
                          ${course.discounted_price}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${course.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-800">
                        {course.price === 0 ? "Free" : `$${course.price}`}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 text-sm font-medium py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course.slug);
                      }}
                    >
                      More Details
                    </Button>
                    <Button
                      className="flex-1 text-sm font-medium py-2"
                      disabled={!isBookable}
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(
                          `Add ${course.title} to cart for $${coursePrice}!`
                        );
                      }}
                    >
                      {course.price === 0
                        ? "Enroll for Free"
                        : hasDiscount
                        ? `Buy $${coursePrice}`
                        : `Buy $${course.price}`}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrows for mobile */}
        {itemsPerPage === 1 && courses.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-25 left-4 transform -translate-y-1/2  bg-white p-2 rounded-full shadow-md hover:text-yellow-600 cursor-pointer"
              aria-label="Previous course"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="absolute  top-25 right-4 transform -translate-y-1/2  bg-white p-2 rounded-full shadow-md hover:text-yellow-600 cursor-pointer"
              aria-label="Next course"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Pagination dots for mobile */}
      {itemsPerPage === 1 && courses.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => setCurrentIndex(pageIndex)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                pageIndex === currentIndex
                  ? "bg-yellow-500"
                  : "bg-gray-300 cursor-pointer"
              }`}
              aria-label={`Go to course ${pageIndex + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
