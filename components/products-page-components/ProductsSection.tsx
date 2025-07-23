import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductList from "@/components/products-page-components/ProductList";
import FilterSidebar from "@/components/products-page-components/FilterSidebar";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import SkeletonProductList from "@/components/ui/SkeletonProductList";

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

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("newest");

  const [filters, setFilters] = useState<Filters>({
    searchQuery: "",
    priceRange: 30,
    categories: [],
    ingredients: [],
    collections: [],
    occasionals: [],
  });

  const [categoriesData, setCategoriesData] = useState<
    { category_id: number; name: string; category_slug: string }[]
  >([]);

  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  const filterOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Best Selling", value: "best_selling" },
    { label: "Price: Low to High", value: "price_low" },
    { label: "Price: High to Low", value: "price_high" },
    { label: "Biggest Discount", value: "discount_high" },
    { label: "A to Z", value: "alphabet_asc" },
    { label: "Z to A", value: "alphabet_desc" },
  ];

  const ingredientsList = [
    "Strawberry",
    "Pumpkin",
    "Caramel",
    "Cinnamon",
    "Chocolate",
    "Cherries",
    "Vanilla",
    "Lemon",
    "Peach",
    "Blueberries",
    "Mixed Berries",
    "Banana",
    "Raisins",
    "Rum",
    "Coffee",
    "Rose Petals",
  ];

  const collectionsList = [
    "Summer I Miss U",
    "Autumn in My Heart",
    "Starlight Series",
    "Happy Birthday!",
  ];

  const seasonalList = [
    "Christmas",
    "Valentine's",
    "Easter",
    "New Year",
    "Halloween",
    "Mother's Day",
    "Father's Day",
  ];

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/products/categories");
        setCategoriesData(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load categories"
        );
      }
    };

    fetchCategories();
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      priceRange: 30,
      categories: [],
      ingredients: [],
      collections: [],
      occasionals: [],
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Check if any filters are active
  const isFiltering =
    filters.searchQuery !== "" ||
    filters.priceRange < 30 ||
    filters.categories.length > 0 ||
    filters.ingredients.length > 0 ||
    filters.collections.length > 0 ||
    filters.occasionals.length > 0;

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sort,
      };

      // Add filter parameters
      if (filters.searchQuery) params.search = filters.searchQuery;
      if (filters.categories.length > 0)
        params.category_id = filters.categories.join(",");
      if (filters.ingredients.length > 0)
        params.ingredients = filters.ingredients.join(",");
      if (filters.collections.length > 0)
        params.collection = filters.collections.join(",");
      if (filters.occasionals.length > 0)
        params.seasonal = filters.occasionals[0];
      if (filters.priceRange < 30) params.maxPrice = filters.priceRange;

      const response = await axios.get("/api/products", { params });

      setProducts(response.data.product || []);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sort, filters]);

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle pagination change
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage > 0 && newPage <= pagination.totalPages) {
        setPagination((prev) => ({ ...prev, page: newPage }));
      }
    },
    [pagination.totalPages]
  );

  // Handle sort change
  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  if (error && !loading) {
    return (
      <div className="mt-8 flex justify-center">
        <div className="text-center py-16">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col lg:flex-row w-full min-h-screen">
        {/* Left: Filters Sidebar */}
        <div className="lg:w-[20%]">
          <FilterSidebar
            categories={categoriesData}
            ingredients={ingredientsList}
            collections={collectionsList}
            occasionals={seasonalList}
            onFilterChange={handleFilterChange}
            currentFilters={filters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Right: Product Listing Area */}
        <div className="flex flex-col w-full lg:w-[80%]">
          {/* Header with title and sort */}
          <div className="flex flex-col lg:flex-row mx-4 justify-between item-start lg:items-center mb-4 lg:mx-8">
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold">
                Our Products
              </h2>
              <p className="text-xs lg:text-base text-gray-600">
                Fresh from the oven - artisan breads, pastries & treats
              </p>
              {/* Show filter status */}
              {isFiltering && (
                <p className="text-sm text-blue-600 mt-1">
                  Showing filtered results ({pagination.total} items)
                </p>
              )}
            </div>

            <div className="mt-4 lg:mt-0 lg:w-52">
              <Select
                name="sort"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                options={filterOptions}
                placeholder="Sort By"
                variant="user"
              />
            </div>
          </div>

          {/* Products and Pagination */}
          {loading ? (
            <SkeletonProductList />
          ) : (
            <div className="mb-8">
              <ProductList
                products={products}
                isFiltering={isFiltering}
                onClearFilters={handleClearFilters}
              />

              {/* Only show pagination if we have products */}
              {products.length > 0 && pagination.totalPages > 1 && (
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  showInfo={true}
                  maxVisiblePages={5}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
