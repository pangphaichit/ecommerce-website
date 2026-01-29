import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

interface Category {
  category_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  category_slug: string;
}

interface PositionedCategory extends Category {
  gridColumn: string;
  gridRow: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Filters {
  searchQuery: string;
  priceRange: number;
  categories: number[];
  ingredients: string[];
  collections: string[];
  occasionals: string[];
}

const computeGridPlacement = (categories: Category[]): PositionedCategory[] => {
  return categories.map((cat, index) => ({
    ...cat,
    gridColumn: `${(index % 4) + 1} / span 1`,
    gridRow: `${Math.floor(index / 4) + 1} / span 1`,
  }));
};

export default function CategoriesDisplay() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({
    searchQuery: "",
    priceRange: 30,
    categories: [],
    ingredients: [],
    collections: [],
    occasionals: [],
  });

  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  useEffect(() => {
    const { category_id } = router.query;

    if (category_id) {
      setFilters((prev) => ({
        ...prev,
        categories: [Number(category_id)],
      }));

      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  }, [router.query.category_id]);

  const handleCategoryClick = (category: Category) => {
    router.push(`/products?category=${category.category_slug}`);
  };

  const itemsPerSlide = 4;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + itemsPerSlide) % categories.length);
  };

  const getMobileVisibleItems = () => {
    const items = [];
    for (let i = 0; i < itemsPerSlide; i++) {
      const item = categories[(currentIndex + i) % categories.length];
      if (item) items.push(item);
    }
    return items;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/products/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth < 1024) {
        nextSlide();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [categories]);

  const desktopItems = computeGridPlacement(categories);

  return (
    <div>
      <div className="relative w-full max-w-[93%] lg:max-w-[95%] mx-auto">
        {/* Mobile */}
        <div className="block lg:hidden">
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 h-70">
              {getMobileVisibleItems().map((cat, index) =>
                cat ? (
                  <div
                    key={`${cat.category_id}-${currentIndex}-${index}`}
                    className="relative overflow-hidden rounded-lg cursor-pointer group shadow-lg transform transition-transform duration-300 hover:scale-105"
                    style={{
                      backgroundImage: cat.image_url
                        ? `url(${cat.image_url})`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <h3 className="font-semibold text-lg truncate">
                        {cat.name}
                      </h3>
                    </div>
                    <div className="absolute inset-0 bg-black/80 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-start text-center">
                      <h3 className="text-lg font-bold mb-2">{cat.name}</h3>
                      <p className="text-xs leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                ) : null,
              )}
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({
                length: Math.ceil(categories.length / itemsPerSlide),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerSlide)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    Math.floor(currentIndex / itemsPerSlide) === index
                      ? "bg-yellow-500"
                      : "bg-gray-300 cursor-pointer"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-4 auto-rows-[140px]">
            {desktopItems.map((cat) => (
              <div
                key={cat.category_id}
                className="relative overflow-hidden rounded-lg cursor-pointer group shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{
                  gridColumn: cat.gridColumn,
                  gridRow: cat.gridRow,
                  backgroundImage: cat.image_url
                    ? `url(${cat.image_url})`
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                  <h3 className="font-bold text-2xl mb-1">{cat.name}</h3>
                </div>
                <div className="absolute inset-0 bg-black/80 text-white p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-start text-center z-20">
                  <h3 className="text-2xl font-bold mb-3">{cat.name}</h3>
                  <p className="text-sm leading-relaxed">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
