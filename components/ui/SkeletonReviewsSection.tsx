import React, { useState, useEffect } from "react";

export default function SkeletonReviewsSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const skeletonItems = isMobile ? Array(1).fill(null) : Array(4).fill(null);

  return (
    <div className="bg-gray-100 py-4 mt-8">
      <div className="relative w-full max-w-[93%] lg:max-w-[95%] mx-auto pt-3 pb-4">
        <h2 className="text-xl lg:text-2xl text-yellow-600 font-bold mb-4 text-center">
          Customer Reviews
        </h2>

        <div className="grid gap-4 justify-items-center grid-cols-1 lg:grid-cols-4">
          {skeletonItems.map((_, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl shadow-md overflow-hidden w-full animate-pulse"
            >
              {/* Image skeleton */}
              <div className="h-45 w-full bg-gray-300" />

              {/* Profile image skeleton */}
              <div className="absolute left-1/2 top-35 transform -translate-x-1/2 z-10">
                <div className="w-18 h-18 lg:w-17 lg:h-17 rounded-full border-2 border-white bg-gray-300" />
              </div>

              {/* Content skeleton */}
              <div className="p-4 mt-7 mb-2 relative space-y-3">
                {/* Stars skeleton */}
                <div className="flex justify-center gap-1">
                  {Array(5)
                    .fill(null)
                    .map((_, j) => (
                      <div key={j} className="w-6 h-6 bg-gray-300 rounded-sm" />
                    ))}
                </div>

                {/* Title skeleton */}
                <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto" />

                {/* Review text skeleton */}
                <div className="space-y-2 my-3">
                  <div className="h-3 bg-gray-300 rounded w-full" />
                  <div className="h-3 bg-gray-300 rounded w-full" />
                  <div className="h-3 bg-gray-300 rounded w-5/6" />
                  <div className="h-3 bg-gray-300 rounded w-4/5" />
                </div>
              </div>

              {/* Helpful count skeleton */}
              <div className="absolute bottom-3 right-4 flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <div className="h-3 w-20 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots skeleton for mobile */}
        <div className="lg:hidden flex justify-center mt-6 space-x-2">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
