import React from "react";

export default function SkeletonCategories() {
  const skeletonItems = Array(12).fill(null);

  return (
    <div className="relative w-full max-w-[93%] lg:max-w-[95%] mx-auto my-8">
      {/* Mobile Skeleton */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-2 gap-3 h-70">
          {skeletonItems.slice(0, 4).map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-gray-300 animate-pulse"
              style={{ height: "100%" }}
            />
          ))}
        </div>
        {/* Dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"
              />
            ))}
        </div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden lg:grid grid-cols-4 gap-4 auto-rows-[140px] mt-4">
        {skeletonItems.map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-gray-300 animate-pulse"
            style={{ width: "100%", height: "140px" }}
          />
        ))}
      </div>
    </div>
  );
}
