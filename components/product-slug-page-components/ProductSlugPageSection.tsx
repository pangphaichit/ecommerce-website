import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  Plus,
  Minus,
  Heart,
  Store,
  Truck,
  Bean,
  Wheat,
  Egg,
  Circle,
  Milk,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ReturnsAndDeliverySection from "@/components/product-slug-page-components/ReturnsAndDeliverySection";

interface ProductImage {
  id: number;
  image_url: string;
  created_at: string;
}

type Product = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  price: number;
  size: string;
  allergens?: string[];
  ingredients?: string[];
  key_features?: string[];
  reviews?: string;
  images?: ProductImage[];
};

export default function ProductSlugPageSection() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

  // Mobile slider states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Desktop → Show Key Features by default
        setActiveTab("Key Features");
      } else {
        // Mobile → Collapse all by default
        setActiveTab("");
      }
    };

    // Run once on mount
    handleResize();

    // Listen for screen size changes
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [router.isReady, slug]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Function to handle thumbnail click
  const handleThumbnailClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  // Create array of all available images (main image + additional images)
  const allImages = useMemo(() => {
    if (!product) return [];
    const images = [
      { id: 0, image_url: product.image_url, created_at: "" }, // Main image
      ...(product.images || []),
    ];
    return images;
  }, [product?.image_url, product?.images]);

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < allImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  // Handle dot click
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Auto-sync desktop selected image with mobile slider
  useEffect(() => {
    if (selectedImageUrl) {
      const index = allImages.findIndex(
        (img) => img.image_url === selectedImageUrl
      );
      if (index !== -1) {
        setCurrentImageIndex(index);
      }
    }
  }, [selectedImageUrl, allImages]);

  // Capitalize first letter of each word
  const capitalize = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

  // Split ingredients into array by comma and capitalize
  const formatIngredients = (ingredients: string) =>
    ingredients.split(",").map((item) => capitalize(item.trim()));

  // Example allergen icons mapping
  const allergenIcons: Record<string, React.ReactNode> = {
    Nuts: <Bean size={16} className="text-yellow-600" />,
    Gluten: <Wheat size={16} className="text-yellow-600" />,
    Eggs: <Egg size={16} className="text-yellow-600" />,
    Dairy: <Milk size={16} className="text-yellow-600" />,
  };

  if (!product) return null;

  const tabContent: Record<string, string | string[]> = {
    "Key Features":
      product.key_features || "This product has amazing key features!",
    Ingredients: product.ingredients || "Ingredients data coming soon...",
    Allergens:
      product.allergens || "Allergen information will be available later.",
    Reviews: product.reviews || "Customer reviews will be displayed here soon.",
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !product)
    return <div className="p-8 text-center text-red-600">No product found</div>;

  return (
    <div className="flex flex-col lg:w-[70%] mx-auto w-full gap-2">
      {/* Product Info */}
      <div className="flex flex-col lg:flex-row mb-4 gap-2">
        <div className="lg:order-1 order-2 hidden lg:block">
          {allImages.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className={`border-2  transition-all duration-200 mb-2 ${
                selectedImageUrl === image.image_url
                  ? "border-yellow-600"
                  : "border-gray-200 hover:border-yellow-400 cursor-pointer "
              }`}
              onClick={() => handleThumbnailClick(image.image_url)}
            >
              <Image
                src={image.image_url}
                alt={`${product.name} - Image ${index + 1}`}
                width={60}
                height={60}
                className="w-10 h-10 object-cover"
              />
            </div>
          ))}
        </div>
        <div className=" lg:w-[40%] lg:order-2 order-1">
          {/* Desktop Image Display */}
          <div className="hidden lg:block">
            <Image
              src={selectedImageUrl || product.image_url}
              alt={product.name}
              width={150}
              height={150}
              className="w-full h-[300px] lg:h-[450px] object-cover"
            />
          </div>

          {/* Mobile Image Slider */}
          <div className="lg:hidden relative">
            <div
              ref={sliderRef}
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                }}
              >
                {allImages.map((image, index) => (
                  <div
                    key={`${image.id}-${index}`}
                    className="w-full flex-shrink-0"
                  >
                    <Image
                      src={image.image_url}
                      alt={`${product.name} - Image ${index + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-[300px] object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            {allImages.length > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? "bg-yellow-600 w-6"
                        : "bg-gray-300 hover:bg-gray-400 cursor-pointer"
                    }`}
                    onClick={() => handleDotClick(index)}
                  />
                ))}
              </div>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>

        <div className=" lg:w-[60%] lg:order-3 order-3 ">
          <div className="mx-4 flex flex-col gap-4  lg:mx-4">
            <div className="flex flex-row  justify-between items-center mt-4 lg:mt-0">
              <h1 className="text-[1.1rem] lg:text-2xl font-semibold text-center">
                {product.name}
              </h1>
              <div className="flex items-center">
                <Heart size={18} className="lg:w-5 lg:h-5" />
              </div>
            </div>
            <p className="text-base lg:text-lg">{product.description}</p>

            <div className="flex flex-row justify-between">
              {/* Quantity */}
              <div className="flex flex-row gap-2">
                <Button variant="lightyellow" className="rounded-full p-3">
                  <Minus size={15} onClick={decrementQuantity} />
                </Button>
                <input
                  type="text"
                  value={quantity}
                  className="w-[15%] border-2 rounded-lg p-2 border-gray-300 text-center"
                ></input>
                <Button variant="lightyellow" className="rounded-full p-3">
                  <Plus size={15} onClick={incrementQuantity} />
                </Button>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-green-600">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Button */}
            <Button
              variant="yellow"
              className="w-full rounded-none lg:text-lg py-6 fixed left-0 bottom-0 lg:relative"
            >
              Add to Cart
            </Button>
          </div>

          {/* Click & Collect */}
          <div className="mt-6 space-y-4 mx-4  py-5 lg:px-6">
            <div className="flex items-start gap-4">
              <div className="flex flex-row items-center gap-2">
                <Store size={18} className="text-yellow-700" />
                <p className="text-[0.9rem]  text-yellow-700 font-medium">
                  Click & Collect Available
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 ">
              <div className="flex flex-row items-center gap-2">
                <Truck size={18} className="text-green-700" />
                <p className="text-[0.9rem]  text-green-700 font-medium">
                  Free shipping on orders over $50!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Desktop */}
      <div>
        <div className="hidden lg:flex lg:flex-row flex-col gap-2 lg:gap-8 justify-center">
          {[
            "Key Features",
            "Ingredients",
            "Allergens",
            "Reviews",
            "Returns & Delivery",
          ].map((item, index) => (
            <div
              key={index}
              className={`p-3 font-medium ${
                activeTab === item
                  ? "font-semibold border-b-3 border-yellow-600"
                  : "cursor-pointer"
              }`}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="hidden lg:block max-w-3xl mx-auto py-12 min-h-[17rem] h-full">
          {activeTab === "Key Features" && product.key_features ? (
            <ul className="list-disc pl-6 space-y-1">
              {product.key_features.map((feature: string, idx: number) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          ) : activeTab === "Ingredients" && product.ingredients ? (
            <ul className="list-disc pl-6 space-y-1">
              {product.ingredients.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : activeTab === "Allergens" && product.allergens ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {product.allergens.map((allergen: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                >
                  {allergenIcons[allergen] || (
                    <Circle size={16} className="text-gray-400" />
                  )}
                  <span className="capitalize">{allergen}</span>
                </div>
              ))}
            </div>
          ) : activeTab === "Returns & Delivery" ? (
            <ReturnsAndDeliverySection />
          ) : (
            <p className="text-gray-700  flex justify-center">
              {tabContent[activeTab]}
            </p>
          )}
        </div>

        {/* Accordion for Mobile */}
        <div className="lg:hidden flex flex-col gap-2">
          {[
            "Key Features",
            "Ingredients",
            "Allergens",
            "Reviews",
            "Returns & Delivery",
          ].map((item, index) => (
            <div key={index} className="overflow-hidden">
              {/* Header */}
              <div
                className={`flex justify-between items-center p-3 cursor-pointer group border-b-3 transition-colors duration-200 ${
                  activeTab === item
                    ? "border-yellow-600"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab(activeTab === item ? "" : item)}
              >
                <span
                  className={`font-medium transition-colors duration-200 ${
                    activeTab === item
                      ? "font-semibold"
                      : "group-hover:text-yellow-600"
                  }`}
                >
                  {item}
                </span>
                <span
                  className={`transition-colors duration-200 ${
                    activeTab === item ? "" : "group-hover:text-yellow-600"
                  }`}
                >
                  {activeTab === item ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </span>
              </div>

              {/* Content */}
              <div className={`p-4 ${activeTab === item ? "block" : "hidden"}`}>
                {item === "Key Features" && product.key_features ? (
                  <ul className="list-disc pl-6 space-y-1">
                    {product.key_features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                ) : item === "Ingredients" && product.ingredients ? (
                  <ul className="list-disc pl-6 space-y-1">
                    {product.ingredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient}</li>
                    ))}
                  </ul>
                ) : item === "Allergens" && product.allergens ? (
                  <div className="flex flex-wrap gap-4 justify-center">
                    {product.allergens.map((allergen, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                      >
                        {allergenIcons[allergen] || (
                          <Circle size={16} className="text-gray-400" />
                        )}
                        <span className="capitalize">{allergen}</span>
                      </div>
                    ))}
                  </div>
                ) : item === "Returns & Delivery" ? (
                  <ReturnsAndDeliverySection />
                ) : (
                  <p className="text-gray-700">{tabContent[item]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div></div>
    </div>
  );
}
