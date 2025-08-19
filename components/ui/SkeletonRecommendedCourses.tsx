import { useState, useEffect } from "react";

interface RecommendedCoursesSkeletonProps {
  title?: string;
  count?: number;
}

export default function SkeletonRecommendedCourses({
  title = "Recommended Courses",
  count = 4,
}: RecommendedCoursesSkeletonProps) {
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? count : 1);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [count]);

  // Generate skeleton cards based on responsive behavior
  const skeletonCards = Array(itemsPerPage).fill(null);

  return (
    <div className="w-full">
      {/* Title Skeleton */}
      <div className="flex justify-center mb-6">
        <div className="h-7 w-64 bg-gray-300 rounded animate-pulse" />
      </div>

      {/* Course Cards Container */}
      <div className="relative">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="flex flex-col group border border-gray-200 rounded-xl overflow-hidden relative"
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none" />

              {/* Image Section */}
              <div className="relative w-full h-52 bg-gray-200 animate-pulse">
                {/* Bestseller badge placeholder */}
                <div className="absolute top-2 left-2 w-24 h-6 bg-gray-300 rounded animate-pulse" />
              </div>

              {/* Content Section */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Title */}
                <div className="h-5 w-4/5 bg-gray-300 rounded mb-2 animate-pulse" />

                {/* Description */}
                <div className="mb-3 space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Outcomes Section */}
                <div className="mb-4 flex-1">
                  {/* "What You'll Learn" title */}
                  <div className="h-4 w-32 bg-gray-300 rounded mb-2 animate-pulse" />

                  {/* Outcome items */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        {/* Check icon placeholder */}
                        <div className="w-4 h-4 bg-gray-200 rounded-full mt-0.5 flex-shrink-0 animate-pulse" />
                        {/* Outcome text */}
                        <div className="h-4 flex-1 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                    {/* "+X more outcomes" placeholder */}
                    <div className="ml-6 h-4 w-24 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>

                {/* Price Section */}
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 bg-gray-300 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1 h-10 bg-gray-300 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow placeholders for mobile */}
        {itemsPerPage === 1 && (
          <>
            <div className="absolute top-25 left-4 transform -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="absolute top-25 right-4 transform -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          </>
        )}
      </div>

      {/* Pagination dots for mobile */}
      {itemsPerPage === 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: count }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className={`w-3 h-3 bg-gray-300 rounded-full animate-pulse ${
                pageIndex === 0 ? "opacity-100" : "opacity-50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Add this to your global CSS or Tailwind config for the shimmer effect
/*
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
*/
