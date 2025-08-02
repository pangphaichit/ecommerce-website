import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Button from "./Button";
import { cn } from "@/lib/utils";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  showInfo = true,
  maxVisiblePages = 5,
}) => {
  const { page, totalPages, total, limit } = pagination;

  // Local state to control quick jump input
  const [inputValue, setInputValue] = React.useState(page.toString());

  React.useEffect(() => {
    setInputValue(page.toString());
  }, [page]);

  const getVisiblePages = React.useCallback((): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(2, page - half);
      let end = Math.min(totalPages - 1, start + maxVisiblePages - 3);

      // Adjust start if end is too close to totalPages
      start = Math.max(2, end - (maxVisiblePages - 3));

      if (start > 2) {
        pages.push("ellipsis");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [page, totalPages, maxVisiblePages]);

  const visiblePages = React.useMemo(
    () => getVisiblePages(),
    [getVisiblePages]
  );

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  if (totalPages <= 1) return null;

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty input for user editing
    if (val === "") {
      setInputValue("");
      return;
    }
    // Only allow numbers
    if (/^\d+$/.test(val)) {
      setInputValue(val);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = Number(inputValue);
      if (!isNaN(val)) {
        if (val < 1) onPageChange(1);
        else if (val > totalPages) onPageChange(totalPages);
        else onPageChange(val);
      } else {
        setInputValue(page.toString());
      }
    }
  };

  const handleInputBlur = () => {
    // Reset input if invalid or empty on blur
    if (
      !inputValue ||
      Number(inputValue) < 1 ||
      Number(inputValue) > totalPages
    ) {
      setInputValue(page.toString());
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Pagination Controls */}
      <div className="flex items-center space-x-2 mt-8">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        {visiblePages.map((pageNum, index) =>
          pageNum === "ellipsis" ? (
            <Button
              key={`ellipsis-${index}`}
              variant="ghost"
              size="icon"
              disabled
              className="rounded-full"
              aria-hidden="true"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(pageNum as number)}
              aria-current={pageNum === page ? "page" : undefined}
              aria-label={`Go to page ${pageNum}`}
              className={cn(
                "rounded-full",
                pageNum === page && "bg-yellow-600 text-white"
              )}
            >
              {pageNum}
            </Button>
          )
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Pagination Info */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {total} results
        </div>
      )}

      {/* Quick Jump */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-2 text-sm">
          <label htmlFor="page-jump" className="text-gray-600">
            Go to page:
          </label>
          <input
            id="page-jump"
            type="number"
            min={1}
            max={totalPages}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-yellow-300"
            aria-label="Page number input"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <span className="text-gray-600">of&nbsp; {totalPages}</span>
          <span className="text-xs text-gray-400 italic select-none">
            Press Enter to go
          </span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
