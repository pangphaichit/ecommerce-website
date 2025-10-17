import { useState, useEffect } from "react";

export default function SkeletonBlogList() {
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

  // Create an array with the number of skeleton cards
  const skeletonArray = Array(itemsPerRow * 2).fill(null); // 2 rows of skeleton cards

  return (
    <div
      className="w-full max-w-[93%] lg:max-w-[95%] mx-auto grid gap-4 mb-4"
      style={{ gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))` }}
    >
      {skeletonArray.map((_, idx) => (
        <div
          key={idx}
          className="group border border-gray-200 rounded-xl overflow-hidden relative cursor-pointer animate-pulse"
        >
          <div className="relative h-52 bg-gray-200" />

          <div className="p-4 relative">
            {/* Product Name */}
            <div className="h-5 w-3/4 bg-gray-300 rounded mb-2" />

            {/* Description */}
            <div className="mt-2 space-y-1">
              <div className="h-3 w-full bg-gray-300 rounded" />
              <div className="h-3 w-5/6 bg-gray-300 rounded" />
              <div className="h-3 w-2/3 bg-gray-300 rounded" />
            </div>

            {/* Buttons */}
            <div className="mt-3 flex gap-2">
              <div className="h-8 flex-1 bg-gray-300 rounded-full" />
              <div className="h-8 w-8 bg-gray-300 rounded-full" />
            </div>

            {/* Price */}
            <div className="h-5 w-12 bg-gray-300 rounded absolute top-4 right-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
