import { useState, useEffect } from "react";

export default function SkeletonBlogList() {
  const [itemsPerRow, setItemsPerRow] = useState(1);

  useEffect(() => {
    function handleResize() {
      setItemsPerRow(window.innerWidth >= 1024 ? 3 : 1);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const skeletonCount = itemsPerRow * 2;

  return (
    <div
      className={`grid gap-6 grid-cols-1 lg:grid-cols-${itemsPerRow} mt-3 mb-6 lg:mt-6`}
    >
      {Array.from({ length: skeletonCount }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="relative w-full h-64 bg-gray-200" />

          <div className="p-4">
            <div className="w-32 h-5 bg-gray-300 rounded-full mb-3" />
            <div className="w-full h-6 bg-gray-300 rounded mb-2" />
            <div className="w-full h-4 bg-gray-300 rounded mb-2" />
            <div className="w-3/4 h-4 bg-gray-300 rounded mb-4" />
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-full bg-gray-300" />
              <div className="flex-1">
                <div className="w-50 h-3 bg-gray-300 rounded mb-1" />
              </div>
            </div>
            <div className="w-3/4 h-4 bg-gray-300 rounded mt-4" />
          </div>

          <div className="px-4 py-4 border-t border-gray-100 flex">
            <div className="w-20 lg:w-25 h-4 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
