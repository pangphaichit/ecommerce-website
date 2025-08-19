import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface SliderImage {
  id?: number | string;
  src: string;
  alt?: string;
}

interface ImageSliderProps {
  images: SliderImage[];
  autoPlayInterval?: number;
  height?: string;
  width?: string;
  dotColor?: string;
  activeDotColor?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  autoPlayInterval = 5000,
  height = "h-[480px] lg:h-[550px]",
  width = "w-full",
  dotColor = "bg-white",
  activeDotColor = "bg-blue-500",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const goToSlide = (index: number) => setCurrentIndex(index);

  useEffect(() => {
    if (!autoPlay || images.length === 0) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length]);

  if (images.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">No images available</p>
    );
  }

  return (
    <div className={`relative ${width} mx-auto mt-4 lg:mt-10`}>
      <div className={`relative ${height} overflow-hidden lg:rounded-xl`}>
        {images.map((image, idx) => (
          <div
            key={image.id || idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              currentIndex === idx
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt || `Slide ${idx + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === idx}
            />
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full transition-colors duration-200 
    ${currentIndex === idx ? activeDotColor : dotColor} 
    ${currentIndex !== idx ? "cursor-pointer" : "cursor-default"}`}
              onClick={() => goToSlide(idx)}
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white hover:text-yellow-600  p-3 rounded-full shadow-md transition-all duration-200 z-20 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white hover:text-yellow-600  p-3 rounded-full shadow-md transition-all duration-200 z-20 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;
