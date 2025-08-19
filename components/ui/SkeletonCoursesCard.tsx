import { useState, useEffect } from "react";

export default function SkeletonCoursesCard() {
  // Responsive items per row
  const [itemsPerRow, setItemsPerRow] = useState(1);

  useEffect(() => {
    function handleResize() {
      setItemsPerRow(window.innerWidth >= 1024 ? 3 : 1);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2 rows of skeleton cards
  const skeletonArray = Array(itemsPerRow * 2).fill(null);

  return (
    <div className="w-full  lg:max-w-[95%] mx-auto grid gap-4 grid-cols-1 lg:grid-cols-3 mb-4 lg:mb-8">
      {skeletonArray.map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col group border border-gray-200 rounded-xl overflow-hidden relative"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none" />
          {/* Image Section */}
          <div className="relative w-full h-52 bg-gray-200">
            {/* Bestseller badge placeholder */}
            <div className="absolute top-2 left-2 w-20 h-6 bg-gray-300 rounded" />
          </div>

          {/* Tags and Bookmark Section */}
          <div className="flex justify-between">
            <div className="flex flex-wrap gap-2 mx-4 mt-4">
              {/* Duration tag */}
              <div className="h-7 w-12 bg-gray-300 rounded-full" />
              {/* Difficulty tag */}
              <div className="h-7 w-16 bg-gray-300 rounded-full" />
              {/* Kids tag (sometimes) */}
              <div className="h-7 w-10 bg-gray-300 rounded-full" />
              {/* Online tag (sometimes) */}
              <div className="h-7 w-12 bg-gray-300 rounded-full" />
            </div>
            {/* Bookmark button */}
            <div className="mx-4 mt-4 w-6 h-6 bg-gray-300 rounded-full" />
          </div>

          {/* Content Section */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Title */}
            <div className="h-5 w-3/4 bg-gray-300 rounded mb-2" />

            {/* Description */}
            <div className="mt-2 flex-1 space-y-2">
              <div className="h-3 w-full bg-gray-300 rounded" />
              <div className="h-3 w-5/6 bg-gray-300 rounded" />
              <div className="h-3 w-2/3 bg-gray-300 rounded" />
            </div>

            {/* Price Section */}
            <div className="mt-4">
              {/* Price (with discount possibility) */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-16 bg-gray-300 rounded" />
                <div className="h-4 w-12 bg-gray-200 rounded" />
              </div>

              {/* Button */}
              <div className="w-full h-12 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
