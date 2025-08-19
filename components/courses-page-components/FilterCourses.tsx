import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DaisyCheckbox from "@/components/ui/DaisyCheckbox";
import FilterSection from "@/components/ui/FilterSection";

export interface Filters {
  searchQuery: string;
  categories: number[];
  formats: string[];
  difficultyLevels: string[];
}

interface FilterSidebarProps {
  categories: { category_id: number; name: string; category_slug: string }[];
  formats: string[];
  difficultyLevels: string[];
  onFilterChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
  currentFilters: Filters;
  isLoading?: boolean;
}

export default function FilterCourses({
  categories,
  formats,
  difficultyLevels,
  onFilterChange,
  currentFilters,
  isLoading = false,
  onClearFilters,
}: FilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedDifficultyLevels, setSelectedDifficultyLevels] = useState<
    string[]
  >([]);
  const [showFilters, setShowFilters] = useState(false);

  // Add clear filters handler
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedFormats([]);
    setSelectedDifficultyLevels([]);
    if (onClearFilters) {
      onClearFilters();
    }
  };

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize state from currentFilters
  useEffect(() => {
    setSearchQuery(currentFilters.searchQuery);
    setSelectedCategories(currentFilters.categories);
    setSelectedFormats(currentFilters.formats);
    setSelectedDifficultyLevels(currentFilters.difficultyLevels);
  }, [currentFilters]);

  // Helper function to get current filter state - FIXED: Return actual values, not setter functions
  const getCurrentFilters = useCallback(
    () => ({
      searchQuery,
      categories: selectedCategories,
      formats: selectedFormats,
      difficultyLevels: selectedDifficultyLevels,
    }),
    [searchQuery, selectedCategories, selectedFormats, selectedDifficultyLevels]
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
    searchQuery.trim() !== "" || selectedCategories.length > 0;

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
      <div className="py-4 lg:hidden">
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
        <div className="relative flex flex-row items-center justify-center gap-2 lg:px-4 lg:pl-8 lg:pr-0">
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

        <div className="py-4 lg:pl-8 lg:pr-0">
          {/* Filter Sections */}
          <FilterSection title="Format">
            <div className="grid grid-cols-1 gap-1 mb-4">
              {formats.map((format) => (
                <DaisyCheckbox
                  key={format}
                  id={`format-${format}`}
                  checked={selectedFormats.includes(format)}
                  onChange={() => {
                    const isSelected = selectedFormats.includes(format);
                    setSelectedFormats(isSelected ? [] : [format]);
                  }}
                >
                  {format}
                </DaisyCheckbox>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Difficulty Level">
            <div className="grid grid-cols-1 gap-1 mb-4">
              {difficultyLevels.map((level) => (
                <DaisyCheckbox
                  key={level}
                  id={`difficulty-${level}`}
                  checked={selectedDifficultyLevels.includes(level)}
                  onChange={() => {
                    const isSelected = selectedDifficultyLevels.includes(level);
                    setSelectedDifficultyLevels(isSelected ? [] : [level]);
                  }}
                >
                  {level}
                </DaisyCheckbox>
              ))}
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
