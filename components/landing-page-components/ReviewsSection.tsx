import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Star, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import SkeletonReviewsSection from "@/components/ui/SkeletonReviewsSection";

type Review = {
  review_id: number;
  rating: number;
  title: string;
  review_text: string;
  image_url: string;
  created_at: string;
  support_count: number;
  user: {
    user_id: string;
    full_name: string;
    image: string;
  };
};

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("/api/reviews");
        setReviews(res.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const newItemsPerPage = window.innerWidth >= 1024 ? 4 : 1;

      setItemsPerPage((prev) => {
        if (prev !== newItemsPerPage) {
          setCurrentIndex(0);
        }
        return newItemsPerPage;
      });
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const total = reviews.length;
  const totalPages = Math.ceil(total / itemsPerPage);

  const visibleReviews = [];
  for (let i = 0; i < itemsPerPage; i++) {
    const index = (currentIndex + i) % total;
    visibleReviews.push(reviews[index]);
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - itemsPerPage + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + itemsPerPage) % total);
  };

  if (loading) return <SkeletonReviewsSection />;

  return (
    <div className=" bg-gray-100 py-8 mb-8">
      <div className=" relative w-full max-w-[93%] lg:max-w-[95%] mx-auto pt-3 pb-4">
        <h2 className=" text-xl lg:text-2xl text-yellow-600 font-bold mb-4 text-center">
          Customer Reviews
        </h2>
        <div className="relative">
          {/* Arrows */}
          {itemsPerPage === 1 && (
            <>
              <button
                onClick={handlePrev}
                className={`
            absolute cursor-pointer top-25 left-4 transform -translate-y-1/2 
            bg-white p-2 rounded-full shadow-md
            hover:text-yellow-600 transition-transform duration-300
            z-30
          `}
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNext}
                className={`
            absolute cursor-pointer top-25 right-4 transform -translate-y-1/2 
            bg-white p-2 rounded-full shadow-md
            hover:text-yellow-600 transition-transform duration-300
            z-30
          `}
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Grid */}
          <div
            className={`grid gap-4 justify-items-center ${
              itemsPerPage === 1 ? "grid-cols-1" : "grid-cols-4"
            }`}
          >
            {visibleReviews.map((review) => (
              <div
                key={review.review_id}
                className="relative bg-white rounded-lg  overflow-hidden w-full hover:scale-102 shadow-sm hover:shadow-m"
              >
                {/* content here same as before */}
                <div className="h-45 w-full">
                  <Image
                    src={review.image_url}
                    alt={review.title}
                    className="w-full h-full object-cover"
                    sizes="100%"
                    width={10}
                    height={10}
                  />
                </div>

                <div className="absolute left-1/2 top-35 transform -translate-x-1/2 z-10">
                  <Image
                    src={review.user.image}
                    alt={review.user.full_name}
                    className="w-18 h-18 lg:w-17 lg:h-17 rounded-full border-2 border-white shadow object-cover"
                    sizes="100%"
                    width={18}
                    height={18}
                  />
                </div>

                <div className="p-4 mt-7 mb-2 relative">
                  <div className="flex gap-1 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={25}
                        className={
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <h3 className="font-bold text-[0.95rem] text-yellow-600 mt-3 truncate text-center">
                    {review.title}
                  </h3>
                  <p className="text-sm text-gray-600  mt-3 line-clamp-4 whitespace-pre-line mb-6">
                    {review.review_text.length > 180
                      ? review.review_text.slice(0, 180) + "..."
                      : review.review_text}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4 text-sm font-semibold text-gray-500 flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-blue-500" />
                  <span>{review.support_count} found helpful</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className=" lg:hidden flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, pageIndex) => {
              const pageStartIndex = pageIndex * itemsPerPage;
              const isActive =
                Math.floor(currentIndex / itemsPerPage) === pageIndex;

              return (
                <button
                  key={pageIndex}
                  onClick={() => setCurrentIndex(pageStartIndex)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isActive ? "bg-yellow-500" : "bg-gray-300 cursor-pointer"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
