import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Minus, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

interface DaisyCheckboxProps {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  children: React.ReactNode;
  id: string;
}

interface Filters {
  searchQuery: string;
  priceRange: number;
  categories: number[];
  ingredients: string[];
  collections: string[];
  occasionals: string[];
}

interface FilterSidebarProps {
  categories: { category_id: number; name: string; category_slug: string }[];
  ingredients: string[];
  collections: string[];
  occasionals: string[];
  onFilterChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
  currentFilters: Filters;
  isLoading?: boolean;
}

const FilterSection = ({ title, children }: FilterSectionProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-300 mb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full py-2 text-left font-semibold text-gray-700 hover:text-yellow-600 cursor-pointer"
      >
        <span>{title}</span>
        {open ? <Minus size={16} /> : <Plus size={16} />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

// Custom Daisy-style checkbox component
const DaisyCheckbox = ({
  checked,
  onChange,
  children,
  id,
}: DaisyCheckboxProps) => {
  return (
    <div className="form-control flex-1">
      <label className="label cursor-pointer justify-start gap-2 py-1">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="checkbox checkbox-warning checkbox-sm"
        />
        <span className="label-text text-gray-700 hover:text-yellow-600 text-sm">
          {children}
        </span>
      </label>
    </div>
  );
};

export default function FilterSidebar({
  categories,
  ingredients,
  collections,
  occasionals,
  onFilterChange,
  currentFilters,
  isLoading = false,
  onClearFilters,
}: FilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number>(30);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedOccasionals, setSelectedOccasionals] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Add clear filters handler
  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceRange(30);
    setSelectedCategories([]);
    setSelectedIngredients([]);
    setSelectedCollections([]);
    setSelectedOccasionals([]);
    if (onClearFilters) {
      onClearFilters();
    }
  };

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize state from currentFilters
  useEffect(() => {
    setSearchQuery(currentFilters.searchQuery);
    setPriceRange(currentFilters.priceRange);
    setSelectedCategories(currentFilters.categories);
    setSelectedIngredients(currentFilters.ingredients);
    setSelectedCollections(currentFilters.collections);
    setSelectedOccasionals(currentFilters.occasionals);
  }, [currentFilters]);

  // Helper function to get current filter state
  const getCurrentFilters = useCallback(
    () => ({
      searchQuery,
      priceRange,
      categories: selectedCategories,
      ingredients: selectedIngredients,
      collections: selectedCollections,
      occasionals: selectedOccasionals,
    }),
    [
      searchQuery,
      priceRange,
      selectedCategories,
      selectedIngredients,
      selectedCollections,
      selectedOccasionals,
    ]
  );

  // Manual search trigger
  const handleSearch = useCallback(() => {
    onFilterChange(getCurrentFilters());
  }, [getCurrentFilters, onFilterChange]);

  // Debounced search for search query only
  const handleDebouncedSearch = useCallback(
    (query: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        onFilterChange({
          ...getCurrentFilters(),
          searchQuery: query,
        });
      }, 500); // 500ms delay
    },
    [getCurrentFilters, onFilterChange]
  );

  // Search query change handler with debouncing
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Only debounce if there's actual text, otherwise search immediately for empty queries
    if (query.trim() === "") {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      onFilterChange({
        ...getCurrentFilters(),
        searchQuery: "",
      });
    } else {
      handleDebouncedSearch(query);
    }
  };

  // Handle Enter key in search input
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      handleSearch();
    }
  };

  // Simplified category toggle handler
  const handleCategoryToggle = (categoryId: number) => {
    const newCategories =
      selectedCategories[0] === categoryId ? [] : [categoryId];
    setSelectedCategories(newCategories);

    setSelectedCategories(newCategories);
  };

  // Simplified ingredient toggle handler
  const handleIngredientToggle = (ingredient: string) => {
    const newIngredients =
      selectedIngredients[0] === ingredient ? [] : [ingredient];
    setSelectedIngredients(newIngredients);
  };

  // Simplified collection toggle handler
  const handleCollectionToggle = (collection: string) => {
    const newCollections =
      selectedCollections[0] === collection ? [] : [collection];
    setSelectedCollections(newCollections);
  };

  // Simplified occasional toggle handler
  const handleOccasionalToggle = (occasional: string) => {
    const newOccasionals =
      selectedOccasionals[0] === occasional ? [] : [occasional];
    setSelectedOccasionals(newOccasionals);
  };

  // Handle price range change with immediate effect
  const handlePriceRangeChange = (newPrice: number) => {
    setPriceRange(newPrice);
  };

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const isFiltering =
    searchQuery.trim() !== "" ||
    priceRange !== 30 ||
    selectedCategories.length > 0 ||
    selectedIngredients.length > 0 ||
    selectedCollections.length > 0 ||
    selectedOccasionals.length > 0;

  return (
    <div className="w-full bg-white">
      <style jsx global>{`
        /* Daisy UI Checkbox Styles */
        .checkbox {
          flex-shrink: 0;
          --chkbg: var(--bc);
          --chkfg: var(--b1);
          height: 1.5rem;
          width: 1.5rem;
          cursor: pointer;
          appearance: none;
          border-radius: 0.5rem;
          border: 2px solid #e5e7eb;
          background-color: transparent;
          transition: all 0.2s ease;
        }
        .checkbox:focus {
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
          outline: none;
        }
        .checkbox:checked,
        .checkbox[aria-checked="true"] {
          background-color: #f59e0b;
          border-color: #f59e0b;
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
          background-size: 0.75rem;
          background-repeat: no-repeat;
          background-position: center;
        }
        .checkbox:hover {
          border-color: #f59e0b;
        }
        .checkbox-sm {
          height: 1.25rem;
          width: 1.25rem;
        }
        .checkbox-warning:checked {
          background-color: #f59e0b;
          border-color: #f59e0b;
        }
        .form-control {
          display: flex;
          flex-direction: column;
        }
        .label {
          display: flex;
          user-select: none;
          align-items: center;
          padding: 0.25rem 0;
        }
        .label-text {
          color: #374151;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .justify-start {
          justify-content: flex-start;
        }
        /* Custom slider thumb styling */
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 2px solid white;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 2px solid white;
        }
      `}</style>

      {/* Toggle Button for Mobile */}
      <div className="p-4 lg:hidden">
        <Button
          variant="yellow"
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-yellow-500 text-white rounded w-full"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Filters Container */}
      <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
        {/* Search Bar */}
        <div className="relative flex flex-row items-center justify-center gap-2 px-4 lg:pl-8 lg:pr-0">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            onKeyDown={onInputKeyDown}
            className="px-0 py-2 w-[95%] border-b-2 border-gray-300 focus:outline-none focus:border-yellow-600 focus:text-gray-500 text-yellow-600 placeholder-gray-400"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="relative text-gray-300 pl-1 py-3 rounded-r-md cursor-pointer hover:text-yellow-600"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </div>

        <div className="p-4 lg:pl-8 lg:pr-0">
          {/* Filter Sections */}
          <FilterSection title="Price">
            <div className="space-y-4 mb-4">
              {/* Price Range Slider */}
              <div className="relative">
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={priceRange}
                  onChange={(e) =>
                    handlePriceRangeChange(Number(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                      (priceRange / 30) * 100
                    }%, #e5e7eb ${(priceRange / 30) * 100}%, #e5e7eb 100%)`,
                  }}
                />
              </div>
              {/* Price Display with Visual Feedback */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-600">
                    ${priceRange}
                  </span>
                  <span className="text-sm text-gray-500">maximum</span>
                </div>
                <div className="text-xs text-gray-400">$0 - $30 range</div>
              </div>
              {/* Quick Select Buttons */}
              <div className="flex gap-2 flex-wrap w-full max-w-full">
                {[5, 10, 15, 20, 25, 30].map((price) => (
                  <button
                    key={price}
                    onClick={() => handlePriceRangeChange(price)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                      priceRange === price
                        ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                        : "bg-white text-gray-600 border-gray-300 hover:border-amber-300 hover:text-amber-600 cursor-pointer"
                    }`}
                  >
                    ${price}
                  </button>
                ))}
              </div>
              {/* Value Indicator */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">
                  Current filter:
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {priceRange === 0
                    ? "Free items only"
                    : priceRange === 30
                    ? "All prices"
                    : `Items up to $${priceRange}`}
                </div>
              </div>
            </div>
          </FilterSection>

          <FilterSection title="Category">
            <div className="grid grid-cols-2 gap-1 mb-4">
              {categories.map((cat) => (
                <DaisyCheckbox
                  key={cat.category_id}
                  id={`category-${cat.category_id}`}
                  checked={selectedCategories.includes(cat.category_id)}
                  onChange={() => handleCategoryToggle(cat.category_id)}
                >
                  {cat.name}
                </DaisyCheckbox>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Ingredients">
            <div className="grid grid-cols-2 gap-1 mb-4">
              {ingredients.map((ing) => (
                <DaisyCheckbox
                  key={ing}
                  id={`ingredient-${ing}`}
                  checked={selectedIngredients.includes(ing)}
                  onChange={() => handleIngredientToggle(ing)}
                >
                  {ing}
                </DaisyCheckbox>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Collection">
            <div className="grid grid-cols-1 gap-1 mb-4">
              {collections.map((col) => (
                <DaisyCheckbox
                  key={col}
                  id={`collection-${col}`}
                  checked={selectedCollections.includes(col)}
                  onChange={() => handleCollectionToggle(col)}
                >
                  {col}
                </DaisyCheckbox>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Occasional">
            <div className="grid grid-cols-2 gap-1 mb-4">
              {occasionals.map((occ) => (
                <DaisyCheckbox
                  key={occ}
                  id={`occasional-${occ}`}
                  checked={selectedOccasionals.includes(occ)}
                  onChange={() => handleOccasionalToggle(occ)}
                >
                  {occ}
                </DaisyCheckbox>
              ))}
            </div>
          </FilterSection>

          {/* Manual Search Button */}
          <div className="mt-2">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Searching...
                </>
              ) : (
                "Apply All Filters"
              )}
            </Button>
            {isFiltering && (
              <Button
                variant="lightyellow"
                onClick={handleClearFilters}
                className="w-full px-6 mt-2"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
