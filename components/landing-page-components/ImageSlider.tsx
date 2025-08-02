import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Image {
  id: number;
  src: string;
  alt: string;
  Highlight: string;
  title: string;
  description: string;
  bgColor: string;
  action: {
    label: string;
    onClickAction: () => void;
  };
}

const ImageSlider = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const autoPlayInterval = 5000;

  const images: Image[] = [
    {
      id: 1,
      src: "/landing-page/bakery-shop.jpg",
      alt: "Shop History",
      Highlight: "Our Story",
      title: "Welcome to Our Bakery",
      description:
        "Explore the rich history of our bakery and how we started with passion.",
      bgColor: "bg-yellow-100",
      action: {
        label: "Read Shop History",
        onClickAction: () => {
          router.push("/about-us");
        },
      },
    },
    {
      id: 2,
      src: "/landing-page/brownie.jpg",
      alt: "Brownie Best Seller",
      Highlight: "Melt-in-Your-Mouth",
      title: "Best-Selling Brownie",
      description: "Indulge in our signature brownies, the customer favorite!",
      bgColor: "bg-gray-200",
      action: {
        label: "Order Now",
        onClickAction: () => {
          router.push("/products/melt-in-your-mouth-brownie");
        },
      },
    },
    {
      id: 3,
      src: "/landing-page/macarons.jpg",
      alt: "Macaron",
      Highlight: "New Arrival",
      title: "Introducing Our Signature Rose Macarons",
      description:
        "Indulge in the refined taste of our handcrafted Rose Macarons, a true masterpiece of elegance.",
      bgColor: "bg-rose-50",
      action: {
        label: "Order Now",
        onClickAction: () => {
          router.push("/products/macaron-la-rose");
        },
      },
    },
    {
      id: 4,
      src: "/landing-page/baking-course.jpg",
      alt: "Baking Class",
      Highlight: "Baking Classes",
      title: "Learn Baking with Us",
      description:
        "Join our exclusive baking class to master the art of baking.",
      bgColor: "bg-indigo-100",
      action: {
        label: "Join Baking Class",
        onClickAction: () => {
          router.push("/courses");
        },
      },
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoPlay) {
      const intervalId = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(intervalId);
    }
  }, [autoPlay]);

  return (
    <div className="relative w-full mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:w-[95%] lg:mx-auto">
        {/* Image Slider */}
        <div className="relative w-full h-[400px] lg:w-[80%] lg:h-[500px]">
          <div className="flex overflow-hidden relative h-full">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  currentIndex === index ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  width: "100%",
                }}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: "0% 50%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center absolute bottom-4 w-full space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                  currentIndex === index
                    ? "bg-yellow-600 pointer-events-none"
                    : "bg-gray-300"
                }`}
                onClick={() => goToSlide(index)}
                onMouseEnter={() => setAutoPlay(false)}
                onMouseLeave={() => setAutoPlay(true)}
              />
            ))}
          </div>

          {/* Left Button */}
          <button
            onClick={prevSlide}
            className="cursor-pointer absolute left-5 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:text-yellow-600 transition"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Button */}
          <button
            onClick={nextSlide}
            className="cursor-pointer absolute right-5 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:text-yellow-600 transition"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Content */}
        <div
          className={`w-full lg:w-1/2 px-4 py-6 lg:px-10 lg:h-[500px] ${images[currentIndex].bgColor}`}
        >
          {images.map(
            (image, index) =>
              currentIndex === index && (
                <div
                  key={image.id}
                  className="flex flex-col justify-center items-center w-full text-center h-full"
                >
                  {/*Title and Description */}
                  <div className="w-full">
                    <h4 className="text-sm lg:text-xl font-bold">
                      {image.Highlight}
                    </h4>
                    <h3
                      className="mt-5 lg:mt-8 text-xl lg:text-3xl font-extrabold
"
                    >
                      {image.title}
                    </h3>
                    <p className="mt-5 lg:mt-4 text-gray-700 text-base">
                      {image.description}
                    </p>
                    <button
                      onClick={image.action.onClickAction}
                      className="mt-5 lg:mt-8 px-6 py-3 bg-yellow-600 text-white lg:py-5 lg:px-8 hover:bg-yellow-500 transition cursor-pointer"
                      onMouseEnter={() => setAutoPlay(false)}
                      onMouseLeave={() => setAutoPlay(true)}
                    >
                      {image.action.label}
                    </button>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
