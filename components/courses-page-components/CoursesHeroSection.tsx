import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  Star,
  Headset,
  ChefHat,
} from "lucide-react";

interface HeroSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: any;
  features: string[];
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Rise with Expert Guidance",
    description:
      "Savor hands-on lessons from seasoned experts who mix real-world wisdom into every step of your learning recipe.",
    image: "/courses/hero-section-dough.jpg",
    icon: Award,
    features: ["Expert Mentors", "Real-world Projects", "Personal Guidance"],
  },
  {
    id: 2,
    title: "Quality Tools, Fresh Results",
    description:
      "Gain access to the finest tools, rich resources, and skill-building ingredients carefully selected to help you rise.",
    image: "/courses/hero-section-tools.jpg",
    icon: ChefHat,
    features: ["Premium Tools", "Comprehensive Materials", "Certificates"],
  },
  {
    id: 3,
    title: "Warm Support, Anytime You Need It",
    description:
      "From your first step to your final milestone, our friendly team is here with steady guidance, just like a baker tending the oven until the loaf is ready.",
    image: "/courses/hero-section-customer-service.jpg",
    icon: Headset,
    features: ["24/7 Support", "Community", "Personal Guidance"],
  },
];

export default function CoursesHeroSection() {
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 3 : 1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!heroSlides.length) return null;

  const totalPages = Math.ceil(heroSlides.length / itemsPerPage);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % totalPages);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);

  // Slice slides based on itemsPerPage and currentIndex
  const displayedSlides =
    itemsPerPage === 1 ? [heroSlides[currentIndex]] : heroSlides;

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Title with Icon */}
      <div className="flex items-center justify-center">
        <h1 className="text-xl lg:text-2xl font-bold text-yellow-600 mb-6 text-center">
          Grow Your Skills, Warm Your Future
        </h1>
      </div>

      {/* Slides */}
      <div className="relative flex w-full gap-4">
        {displayedSlides.map((slide) => {
          const IconComponent = slide.icon;
          return (
            <div
              key={slide.id}
              className="flex-1 flex flex-col-reverse lg:flex-row border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300"
            >
              {/* Text Section - Right side on desktop, bottom on mobile */}
              <div className="w-full lg:w-2/3 p-4 lg:p-6 flex flex-col bg-gray-50 text-start justify-between">
                <div>
                  <div className="flex mb-3 gap-2">
                    <IconComponent
                      className="block lg:hidden text-yellow-600"
                      size={25}
                    />
                    <h3 className="text-lg lg:text-xl font-bold  text-yellow-600">
                      {slide.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm lg:text-base leading-relaxed">
                    {slide.description}
                  </p>
                </div>

                {/* Feature list with icons */}
                <div className="space-y-2">
                  {slide.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm lg:text-base text-gray-600"
                    >
                      <Star
                        className="text-yellow-600 mr-2 flex-shrink-0"
                        size={16}
                      />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              {/* Image Section - Left side on desktop, top on mobile */}
              <div className="relative w-full lg:w-1/3 flex-shrink-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  className="object-cover object-bottom w-full h-54 lg:h-full"
                  width={400}
                  height={300}
                />
                {/* Icon overlay */}
                <div className="hidden lg:block absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                  <IconComponent className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Arrows (only mobile) */}
        {itemsPerPage === 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/4 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:text-yellow-600 hover:bg-yellow-50 transition-colors duration-200 cursor-pointer z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/4 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:text-yellow-600 hover:bg-yellow-50 transition-colors duration-200 cursor-pointer z-10"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots (only mobile) */}
      {itemsPerPage === 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => setCurrentIndex(pageIndex)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                pageIndex === currentIndex
                  ? "bg-yellow-500"
                  : "bg-gray-300 cursor-pointer hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
