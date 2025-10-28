import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import BlogHeader from "@/components/blogs-page-components/BlogHeader";
import axios from "axios";
import BlogList from "@/components/blogs-page-components/BlogList";
import BlogFilterSidebar from "@/components/blogs-page-components/BlogFilterSidebar";
import Pagination from "@/components/ui/Pagination";
import SkeletonBlogList from "@/components/ui/SkeletonBlogList";

export default function BlogSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  const [authorRole, setAuthorRole] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  const isFetchingRef = useRef(false);
  const lastRequestRef = useRef("");

  const isFiltering = useMemo(
    () => !!searchQuery || (!!category && category !== "All") || !!authorRole,
    [searchQuery, category, authorRole]
  );

  const requestParams = useMemo(() => {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      sort,
    };
    if (category && category !== "All") params.category = category;
    if (authorRole && authorRole !== "All") params.author_role = authorRole;
    if (searchQuery) params.search = searchQuery;
    return params;
  }, [
    pagination.page,
    pagination.limit,
    sort,
    category,
    authorRole,
    searchQuery,
  ]);

  const fetchBlogs = useCallback(async () => {
    const requestKey = JSON.stringify(requestParams);
    if (isFetchingRef.current || requestKey === lastRequestRef.current) return;

    try {
      isFetchingRef.current = true;
      lastRequestRef.current = requestKey;
      setIsLoading(true);
      setError(null);

      const queryString = new URLSearchParams(requestParams).toString();
      const response = await axios.get(`/api/blogs?${queryString}`);

      setBlogs(response.data.blogs || []);
      console.log(response.data.blogs);
      setPagination(response.data.pagination);
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

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleAuthorRoleChange = (role: string) => {
    setAuthorRole(role);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setAuthorRole("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="w-[93%] lg:w-[95%] mx-auto flex flex-col">
      <BlogHeader />

      <BlogFilterSidebar
        blogs={[]}
        isFiltering={isFiltering}
        searchQuery={searchQuery}
        sort={sort}
        category={category}
        authorRole={authorRole}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onCategoryChange={handleCategoryChange}
        onAuthorRoleChange={handleAuthorRoleChange}
        onClearFilters={handleClearFilters}
        totalResults={pagination.total}
      />

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
