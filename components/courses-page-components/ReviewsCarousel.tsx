import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewsCourses from "./ReviewsCourses";

interface Review {
  id: number;
  imageSrc: string;
  name: string;
  review: string;
  backgroundColor?: string;
}

interface ReviewsCarouselProps {
  reviews: Review[];
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update itemsPerPage on window resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024)
        setItemsPerPage(reviews.length); // Desktop: show all
      else setItemsPerPage(1); // Mobile: show 1
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [reviews.length]);

  if (!reviews.length) return null;

  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <div className="relative flex flex-col items-center mt-10  lg:mt-12 lg:mb-6">
      <div className="flex gap-4 lg:gap-6 flex-wrap justify-center">
        {itemsPerPage === 1
          ? [reviews[currentIndex]].map((r) => (
              <ReviewsCourses key={r.id} {...r} />
            ))
          : reviews.map((r) => <ReviewsCourses key={r.id} {...r} />)}
      </div>

      {/* Arrows for mobile */}
      {itemsPerPage === 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-1 -translate-y-1/2 text-gray-400 hover:text-yellow-600 cursor-pointer z-10"
          >
            <ChevronLeft size={25} />
          </button>

          <button
            onClick={handleNext}
            className="absolute top-1/2 -right-1 -translate-y-1/2 text-gray-400 hover:text-yellow-600 cursor-pointer z-10"
          >
            <ChevronRight size={25} />
          </button>

          {/* Pagination dots */}
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
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
