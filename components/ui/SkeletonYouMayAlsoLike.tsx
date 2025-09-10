import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SkeletonYouMayAlsoLike({
  items = 6,
}: {
  items?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 3 : 1);
      setCurrentIndex(0);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(items / itemsPerPage);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));

  const displayedItems = Array.from({ length: items }).slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  return (
    <div className="w-full">
      <h2 className="text-xl lg:text-2xl font-bold text-yellow-600 mb-6 text-center animate-pulse">
        You May Also Like
      </h2>

      <div className="relative">
        <div
          className={`grid gap-4 ${
            itemsPerPage === 1 ? "grid-cols-1" : "lg:grid-cols-3"
          }`}
        >
          {displayedItems.map((_, idx) => (
            <div
              key={idx}
              className="cursor-pointer group border border-gray-200 rounded-xl overflow-hidden relative animate-pulse"
            >
              <div className="relative h-52 bg-gray-300 rounded-md" />

              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 bg-gray-300 w-3/4 rounded-md"></div>
                <div className="h-3 bg-gray-200 w-full rounded-md"></div>
                <div className="h-3 bg-gray-200 w-5/6 rounded-md"></div>

                <div className="mt-3 flex gap-2">
                  <div className="h-8 flex-1 bg-gray-300 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                </div>

                <div className="h-4 w-12 bg-gray-300 rounded-md absolute top-4 right-4"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile arrows */}
        {itemsPerPage === 1 && items > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-25 left-4  transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-25 right-4  transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Mobile pagination dots */}
      {itemsPerPage === 1 && items > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div key={index} className={`w-3 h-3 rounded-full bg-gray-300`} />
          ))}
        </div>
      )}
    </div>
  );
}
