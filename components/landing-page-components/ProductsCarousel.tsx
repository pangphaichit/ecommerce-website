import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useRouter } from "next/router";

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number | null;
  is_available: boolean;
  category_id: number | null;
  size: string;
  ingredients: string;
  allergens: string;
  nutritional_info: string;
  seasonal: string;
  collection: string;
  stock_quantity: number;
  min_order_quantity: number;
  image_url: string;
  slug: string;
  image_file?: File;
}

export default function ProductsCarousel({
  products,
}: {
  products: Product[];
}) {
  const router = useRouter();

  // Track current index of carousel start
  const [currentIndex, setCurrentIndex] = useState(0);

  // rack how many items to show per page (responsive)
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

  const latestProducts = Array.isArray(products) ? products.slice(-8) : [];

  const total = latestProducts.length;

  const totalPages = Math.ceil(total / itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + itemsPerPage) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - itemsPerPage + total) % total);
  };

  const visibleProducts = [];

  for (let i = 0; i < itemsPerPage; i++) {
    const index = (currentIndex + i) % total;
    visibleProducts.push(latestProducts[index]);
  }

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  return (
    <div className="relative w-full max-w-[93%] lg:max-w-[95%] mx-auto">
      <div className="relative">
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

        {/* Grid layout adapts for mobile and desktop */}
        <div
          className={`grid gap-4 ${
            itemsPerPage === 1 ? "grid-cols-1" : "grid-cols-4"
          }`}
        >
          {visibleProducts.map((product) => {
            if (!product) return null;
            return (
              <div
                key={product.product_id}
                onClick={() => handleProductClick(product.slug)}
                className="group border border-gray-200 rounded-xl overflow-hidden relative transition-all cursor-pointer hover:shadow-lg"
              >
                <div className="relative h-52 bg-gray-100">
                  {!product.is_available && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gray-500 bg-opacity-30" />
                      <Badge
                        variant="destructive"
                        className="text-sm z-10 flex items-center justify-center"
                      >
                        Out of Stock
                      </Badge>
                    </div>
                  )}

                  <Image
                    src={`${product.image_url}?t=${Date.now()}`}
                    alt={product.name}
                    className={`relative h-full w-full object-cover ${
                      !product.is_available ? "grayscale opacity-50" : ""
                    }`}
                    sizes="100%"
                    width={10}
                    height={10}
                  />
                </div>

                <div className="p-4 relative">
                  <h3 className="font-bold text-[0.95rem]  text-yellow-600">
                    {product.name.length > 30
                      ? product.name.slice(0, 30) + "..."
                      : product.name}
                  </h3>

                  <div className="mt-0 lg:mt-4 relative h-14">
                    <p
                      className={`mt-3 text-sm text-gray-600 transition-opacity duration-300 ${
                        itemsPerPage === 1 ? "" : "group-hover:opacity-0"
                      }`}
                    >
                      {product.description.length > 120
                        ? product.description.slice(0, 120) + "..."
                        : product.description}
                    </p>

                    {itemsPerPage !== 1 && (
                      <div className="absolute inset-0 flex justify-center items-center gap-2 bg-white bg-opacity-90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          variant="yellow"
                          className="w-full rounded-full text-xs"
                          disabled={!product.is_available}
                        >
                          Add to Cart
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <Heart className="text-yellow-500" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {itemsPerPage === 1 && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="yellow"
                        className="w-full rounded-full text-xs"
                        disabled={!product.is_available}
                      >
                        Add to Bag
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Heart className="text-yellow-500" />
                      </Button>
                    </div>
                  )}

                  <span className="text-[0.95rem] font-semibold absolute top-4 right-4 text-green-600">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 space-x-2">
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
                aria-label={`Go to slide ${pageIndex + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
