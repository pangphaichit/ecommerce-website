// components/product-slug-page-components/YouMayAlsoLike.tsx
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: string | number;
  is_available: boolean;
  image_url: string;
  slug: string;
}

interface Props {
  products: Product[];
}

export default function YouMayAlsoLike({ products }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 3 : 1);
      setCurrentIndex(0); // Reset index when resizing
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  const displayedProducts = products.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  if (products.length === 0) return null;

  return (
    <div className="w-full8">
      <h2 className="text-xl lg:text-2xl font-bold text-yellow-600 mb-6 text-center">
        You May Also Like
      </h2>

      <div className="relative">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {displayedProducts.map((product) => (
            <div
              key={product.product_id}
              className="cursor-pointer group border border-gray-200 rounded-xl overflow-hidden relative hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleProductClick(product.slug)}
            >
              <div className="relative h-52 bg-gray-100">
                {!product.is_available && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-30" />
                    <Badge
                      variant="destructive"
                      className="text-sm z-30 flex items-center justify-center"
                    >
                      Out of Stock
                    </Badge>
                  </div>
                )}
                <Image
                  src={`${product.image_url}?t=${Date.now()}`}
                  alt={product.name}
                  className={`relative h-full w-full object-cover transition-all duration-200 ${
                    !product.is_available ? "grayscale opacity-50" : ""
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  width={400}
                  height={300}
                />
              </div>

              <div className="p-4 relative">
                <h3 className="font-bold text-[0.95rem] text-yellow-600 truncate">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 h-14 overflow-hidden">
                  {product.description.length > 120
                    ? product.description.slice(0, 120) + "..."
                    : product.description}
                </p>

                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="yellow"
                    className="flex-1 rounded-full text-xs"
                    disabled={!product.is_available}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Add ${product.name} to cart!`);
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Favorite ${product.name}!`);
                    }}
                  >
                    <Heart className="text-yellow-500" />
                  </Button>
                </div>

                <span className="text-[0.95rem] font-semibold absolute top-4 right-4 text-green-600">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows for mobile */}
        {itemsPerPage === 1 && products.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-25 left-4 transform -translate-y-1/2  bg-white p-2 rounded-full shadow-md hover:text-yellow-600 cursor-pointer"
              aria-label="Previous course"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="absolute  top-25 right-4 transform -translate-y-1/2  bg-white p-2 rounded-full shadow-md hover:text-yellow-600 cursor-pointer"
              aria-label="Next course"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Pagination dots for mobile */}
      {itemsPerPage === 1 && products.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-yellow-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
