import React, { useState, useEffect } from "react";

export default function SkeletonNewsEventGrid() {
  const [itemsPerRow, setItemsPerRow] = useState(1);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setItemsPerRow(3);
      else if (window.innerWidth >= 768) setItemsPerRow(2);
      else setItemsPerRow(1);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const skeletons = Array.from({ length: itemsPerRow * 2 }); // 2 rows

  return (
    <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-8">
      {skeletons.map((_, idx) => (
        <article
          key={idx}
          className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="w-full h-48 bg-gray-200" />

          {/* Badge and Date Placeholder */}
          <div className="px-6 pt-4 flex items-center justify-between">
            <div className="h-5 w-24 bg-gray-300 rounded-full" />
            <div className="h-4 w-16 bg-gray-300 rounded" />
          </div>

          {/* Title and Text Placeholder */}
          <div className="px-6 py-4 space-y-3">
            <div className="h-6 w-3/4 bg-gray-300 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
          </div>

          {/* Read More Button Placeholder */}
          <div className="px-6 pb-6">
            <div className="h-10 w-32 bg-gray-300 rounded" />
          </div>
        </article>
      ))}
    </div>
  );
}
