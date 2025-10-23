import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { X } from "lucide-react";
import BlogHeader from "@/components/blogs-page-components/BlogHeader";

import BlogList from "@/components/blogs-page-components/BlogList";
import BlogFilterSidebar from "@/components/blogs-page-components/BlogFilterSidebar";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import SkeletonBlogList from "@/components/ui/SkeletonBlogList";

interface Filters {
  searchQuery?: string;
  category?: string;
  authorRole?: string;
  sort?: string;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");

  const [filters, setFilters] = useState<Filters>({});
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  const isFetchingRef = useRef(false);
  const lastRequestRef = useRef("");

  const sortOptions = useMemo(
    () => [
      { label: "Newest First", value: "newest" },
      { label: "Oldest First", value: "oldest" },
      { label: "Most Liked", value: "most_liked" },
      { label: "Most Read", value: "most_read" },
    ],
    []
  );

  const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const isFiltering = useMemo(
    () => !!filters.searchQuery || !!filters.category || !!filters.authorRole,
    [filters]
  );

  const requestParams = useMemo(() => {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      sort,
    };
    if (filters.searchQuery) params.search = filters.searchQuery;
    if (filters.category) params.category = filters.category;
    if (filters.authorRole) params.author_role = filters.authorRole;
    return params;
  }, [pagination.page, pagination.limit, sort, filters]);

  const fetchBlogs = useCallback(async () => {
    const requestKey = JSON.stringify(requestParams);
    if (isFetchingRef.current || requestKey === lastRequestRef.current) return;

    try {
      isFetchingRef.current = true;
      lastRequestRef.current = requestKey;
      setIsLoading(true);
      setError(null);

      const queryString = new URLSearchParams(requestParams).toString();
      const response = await fetch(`/api/blogs?${queryString}`);
      if (!response.ok) throw new Error("Failed to fetch blogs");

      const data = await response.json();
      setBlogs(data.blogs || []);
      console.log(data.blogs);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load blogs");
      setBlogs([]);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [requestParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchBlogs(), 100);
    return () => clearTimeout(timeoutId);
  }, [fetchBlogs]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSort(newSort);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="w-[93%] lg:w-[95%] mx-auto flex flex-col">
      <BlogHeader />

      <BlogFilterSidebar blogs={[]} />

      <div className="flex-1">
        {isLoading ? (
          <SkeletonBlogList />
        ) : (
          <BlogList blogs={blogs} isFiltering={isFiltering} />
        )}
        {pagination.totalPages > 1 && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}
