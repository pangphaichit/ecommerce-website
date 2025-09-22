import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { X } from "lucide-react";
import ProductList from "@/components/products-page-components/ProductList";
import FilterSidebar from "@/components/products-page-components/FilterSidebar";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import SkeletonProductList from "@/components/ui/SkeletonProductList";
import { Product } from "@/types/products";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  // Use ref to track if we're currently fetching to prevent duplicate calls
  const isFetchingRef = useRef(false);

  // Use ref to track the last request parameters to avoid duplicate calls
  const lastRequestRef = useRef<string>("");

  const filterOptions = useMemo(
    () => [
      { label: "Newest First", value: "newest" },
      { label: "Oldest First", value: "oldest" },
      { label: "Best Selling", value: "best_selling" },
      { label: "Price: Low to High", value: "price_low" },
      { label: "Price: High to Low", value: "price_high" },
      { label: "Biggest Discount", value: "discount_high" },
      { label: "A to Z", value: "alphabet_asc" },
      { label: "Z to A", value: "alphabet_desc" },
    ],
    []
  );

  // Make these static to avoid recreating on every render
  const ingredientsList = useMemo(
    () => [
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
    ],
    []
  );

  const collectionsList = useMemo(
    () => [
      "Summer I Miss U",
      "Autumn in My Heart",
      "Starlight Series",
      "Happy Birthday!",
    ],
    []
  );

  const seasonalList = useMemo(
    () => [
      "Christmas",
      "Valentine's",
      "Easter",
      "New Year",
      "Halloween",
      "Mother's Day",
      "Father's Day",
    ],
    []
  );

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

  // Check if any filters are active - memoize this to prevent unnecessary recalculations
  const isFiltering = useMemo(
    () =>
      filters.searchQuery !== "" ||
      filters.priceRange < 30 ||
      filters.categories.length > 0 ||
      filters.ingredients.length > 0 ||
      filters.collections.length > 0 ||
      filters.occasionals.length > 0,
    [filters]
  );

  // Memoize request parameters to detect duplicate calls
  const requestParams = useMemo(() => {
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

    return params;
  }, [pagination.page, pagination.limit, sort, filters]);

  // Fetch products function with duplicate call prevention
  const fetchProducts = useCallback(async () => {
    // Create a unique key for this request
    const requestKey = JSON.stringify(requestParams);

    // Prevent duplicate calls
    if (isFetchingRef.current || requestKey === lastRequestRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      lastRequestRef.current = requestKey;
      setIsLoading(true);
      setError(null);

      const response = await axios.get("/api/products", {
        params: requestParams,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        // Ensure 304 responses are handled properly
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 304;
        },
      });

      // Handle both successful responses and 304 (not modified)
      if (response.status === 304) {
        // Data hasn't changed, keep current products if we have them
        if (products.length === 0) {
          // If we don't have products yet, this might be an issue
          console.log("Received 304 but no cached products available");
        }
      } else {
        // Normal successful response
        setProducts(response.data.product || []);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching products:", err);

      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        } else if (err.request) {
          console.error("No response received:", err.request);
        } else {
          console.error("Request setup error:", err.message);
        }

        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load products");
      }

      setProducts([]);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [requestParams, products.length]);

  // Fetch products when dependencies change with a small debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 100); // Small debounce to prevent rapid successive calls

    return () => clearTimeout(timeoutId);
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

  if (error && !isLoading) {
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
            isLoading={isLoading}
          />
        </div>

        {/* Right: Product Listing Area */}
        <div className="flex flex-col w-full lg:w-[80%]">
          {/* Header with title and sort */}
          <div className="flex flex-col lg:flex-row mx-4 justify-between item-start lg:items-center mb-2 lg:mx-8">
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold">
                Our Products
              </h2>
              <p className="text-base lg:text-lg  mt-2 text-gray-600">
                Fresh from the oven - artisan breads, pastries & treats
              </p>
            </div>

            <div className="mt-4 lg:mt-0 lg:w-52 mb-2">
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

          {/* Show filter status */}
          <div>
            {isFiltering && (
              <div className="flex flex-row justify-between lg:justify-start gap-2 items-center mx-4 my-2 lg:mx-8">
                <button
                  onClick={handleClearFilters}
                  className="flex px-3 py-1 items-center gap-1 mb-4 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  type="button"
                >
                  <p className="text-[0.8rem] lg:text-[0.9rem]">
                    Showing filtered results ( {pagination.total} items )
                  </p>
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Products and Pagination */}
          {isLoading ? (
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
