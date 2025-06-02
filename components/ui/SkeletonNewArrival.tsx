import { useState, useEffect } from "react";

export default function SkeletonNewArrival() {
  // State to track how many items to show per page (responsive)
  const [itemsPerPage, setItemsPerPage] = useState(1);

  // Set itemsPerPage based on window width (mobile=1, desktop=4)
  useEffect(() => {
    function updateItemsPerPage() {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(1);
      }
    }

    updateItemsPerPage();

    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  return (
    <div className="relative w-full max-w-[93%] lg:max-w-[95%] mx-auto my-8">
      <div className="relative">
        {/* Grid layout adapts for mobile and desktop */}
        <div
          className={`grid gap-6 ${
            itemsPerPage === 1 ? "grid-cols-1" : "grid-cols-4"
          }`}
        >
          {[...Array(itemsPerPage)].map((_, index) => (
            <div
              key={index}
              className="group border border-gray-200 rounded-xl overflow-hidden relative animate-pulse"
            >
              <div className="relative h-48 bg-gray-200" />

              <div className="p-4 relative">
                {/* Product name */}
                <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />

                <div className="mt-0 lg:mt-4 relative h-10">
                  <div className="space-y-2 mt-3">
                    <div className="h-3 w-full bg-gray-300 rounded" />
                    <div className="h-3 w-5/6 bg-gray-300 rounded" />
                  </div>
                </div>

                {itemsPerPage === 1 && (
                  <div className="mt-3 flex gap-2">
                    <div className="h-8 w-full bg-gray-300 rounded-full" />
                    <div className="h-8 w-8 bg-gray-300 rounded-full" />
                  </div>
                )}

                <div className="h-4 w-12 bg-gray-300 rounded absolute top-4 right-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots Placeholder */}
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
