import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface ProductImage {
  id: number;
  image_url: string;
  created_at: string;
}

interface Props {
  mainImage: string;
  images?: ProductImage[];
  selectedImageUrl: string;
  setSelectedImageUrl: (url: string) => void;
}

export default function ProductImages({
  mainImage,
  images = [],
  selectedImageUrl,
  setSelectedImageUrl,
}: Props) {
  const allImages = [
    { id: 0, image_url: mainImage, created_at: "" },
    ...images,
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedImageUrl) {
      const index = allImages.findIndex(
        (img) => img.image_url === selectedImageUrl
      );
      if (index !== -1) setCurrentImageIndex(index);
    }
  }, [selectedImageUrl, allImages]);

  const handleThumbnailClick = (url: string) => setSelectedImageUrl(url);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50 && currentImageIndex < allImages.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setSelectedImageUrl(allImages[newIndex].image_url);
    }
    if (distance < -50 && currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setSelectedImageUrl(allImages[newIndex].image_url);
    }
  };
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
    setSelectedImageUrl(allImages[index].image_url);
  };

  return (
    <div className="lg:w-[50%] w-full">
      <div className="flex flex-col lg:flex-row gap-2">
        {/* Desktop Thumbnails */}
        <div className="hidden lg:block lg:order-1 flex-shrink-0">
          {allImages.map((img, idx) => (
            <div
              key={img.id}
              className={`border-2 mb-2 cursor-pointer transition-all ${
                selectedImageUrl === img.image_url
                  ? "border-yellow-600"
                  : "border-gray-200 hover:border-yellow-400"
              }`}
              onClick={() => handleThumbnailClick(img.image_url)}
            >
              <Image
                src={img.image_url}
                alt={`Thumbnail ${idx}`}
                width={60}
                height={60}
                className="w-10 h-10 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main Image / Slider */}
        <div className="lg:order-2 order-1 flex-1">
          {/* Desktop */}
          <div className="hidden lg:block">
            <Image
              src={selectedImageUrl || mainImage}
              alt="Product Image"
              width={600}
              height={450}
              className="w-full h-[300px] lg:h-[450px] object-cover"
            />
          </div>

          {/* Mobile Slider */}
          <div
            className="lg:hidden relative overflow-hidden"
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {allImages.map((img, idx) => (
                <div key={img.id} className="w-full flex-shrink-0">
                  <Image
                    src={img.image_url}
                    alt={`Image ${idx}`}
                    width={400}
                    height={300}
                    className="w-full h-[300px] object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Dots */}
            {allImages.length > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      idx === currentImageIndex
                        ? "bg-yellow-600 w-6"
                        : "bg-gray-300 hover:bg-gray-400 cursor-pointer"
                    }`}
                    onClick={() => handleDotClick(idx)}
                  />
                ))}
              </div>
            )}

            {/* Counter */}
            {allImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
