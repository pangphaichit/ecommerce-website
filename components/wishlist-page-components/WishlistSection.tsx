import Image from "next/image";
import React from "react";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useFavoriteProducts } from "@/hooks/useFavoriteProducts";
import FavoriteProductsList from "@/components/wishlist-page-components/FavoriteProductsList";
import WishlistHeader from "@/components/wishlist-page-components/WishlistHeader";
import Pagination from "@/components/ui/Pagination";
import CustomAlert from "@/components/ui/CustomAlert";
import SkeletonFavoriteProductList from "@/components/ui/SkeletonFavoriteProductList";
import { AlertItem } from "@/types/ui";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function WishlistSection() {
  const { isAuthenticated } = useAuth();
  const { favorites, removeFavorite, loading } = useFavorites();
  const productIds = useMemo(
    () => favorites.map((f) => f.product_id),
    [favorites],
  );
  const [sort, setSort] = useState<string>("newest");
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const { products, loading: productsLoading } =
    useFavoriteProducts(productIds);

  const filterOptions = useMemo(
    () => [
      { label: "Newest First", value: "newest" },
      { label: "Oldest First", value: "oldest" },
      { label: "Price: Low to High", value: "price_low" },
      { label: "Price: High to Low", value: "price_high" },
      { label: "A to Z", value: "alphabet_asc" },
      { label: "Z to A", value: "alphabet_desc" },
    ],
    [],
  );

  const favoriteAddedAtMap = useMemo(() => {
    return new Map(favorites.map((f) => [f.product_id, f.added_at]));
  }, [favorites]);

  const mergedProducts = useMemo(() => {
    return products.map((p) => ({
      ...p,
      added_at: favoriteAddedAtMap.get(p.product_id),
    }));
  }, [products, favoriteAddedAtMap]);

  const sortedProducts = useMemo(() => {
    const list = [...mergedProducts];

    switch (sort) {
      case "newest":
        return list.sort((a, b) => {
          const timeDiff =
            new Date(b.added_at ?? 0).getTime() -
            new Date(a.added_at ?? 0).getTime();

          if (timeDiff !== 0) return timeDiff;

          // tie-breaker (alphabetical or product_id)
          return a.product_id.localeCompare(b.product_id);
        });

      case "oldest":
        return list.sort((a, b) => {
          const timeDiff =
            new Date(a.added_at ?? 0).getTime() -
            new Date(b.added_at ?? 0).getTime();

          if (timeDiff !== 0) return timeDiff;

          // tie-breaker (alphabetical or product_id)
          return a.product_id.localeCompare(b.product_id);
        });

      case "price_low":
        return list.sort((a, b) => {
          const priceA = Number(a.price);
          const priceB = Number(b.price);

          if (isNaN(priceA)) return 1;
          if (isNaN(priceB)) return -1;

          return priceA - priceB;
        });

      case "price_high":
        return list.sort((a, b) => {
          const priceA = Number(a.price);
          const priceB = Number(b.price);

          if (isNaN(priceA)) return 1;
          if (isNaN(priceB)) return -1;

          return priceB - priceA;
        });

      case "alphabet_asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));

      case "alphabet_desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));

      default:
        return list;
    }
  }, [mergedProducts, sort]);

  // Handle sort change
  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Handle pagination change
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage > 0 && newPage <= pagination.totalPages) {
        setPagination((prev) => ({ ...prev, page: newPage }));
      }
    },
    [pagination.totalPages],
  );

  // Update pagination whenever favorites change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: favorites.length,
      totalPages: Math.ceil(favorites.length / prev.limit),
    }));
  }, [favorites]);

  // Slice products for current page
  const currentProducts = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return sortedProducts.slice(start, end);
  }, [sortedProducts, pagination.page, pagination.limit]);

  const showAlert = (
    message: string,
    type: "success" | "error",
    scope: "local" | "global" = "local",
  ) => {
    if (scope === "local") {
      const id = Date.now() + Math.random();

      setAlerts((prev) => [{ id, message, type }, ...prev]);
    } else {
      console.warn("Global alert triggered:", message);
    }
  };

  if (loading) {
    return (
      <div className="px-4 lg:px-8 pb-4">
        <WishlistHeader
          isAuthenticated={isAuthenticated}
          sort={sort}
          onSortChange={handleSortChange}
          options={filterOptions}
        />
        <SkeletonFavoriteProductList />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="px-4 lg:px-8 ">
        <WishlistHeader
          isAuthenticated={isAuthenticated}
          sort={sort}
          onSortChange={handleSortChange}
          options={filterOptions}
        />

        <div className="flex flex-col items-center p-4 lg:p-8">
          <div className="relative flex w-22 h-22 mb-4 opacity-60">
            <Image
              src={"/products/bakerybag.png"}
              alt="No favourite found"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg lg:text-2xl font-medium text-gray-500 mb-2">
            You haven’t added any favourites yet.
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 pb-4">
      <WishlistHeader
        isAuthenticated={isAuthenticated}
        sort={sort}
        onSortChange={handleSortChange}
        options={filterOptions}
      />

      <FavoriteProductsList
        products={currentProducts}
        removeFavorite={(id) => {
          removeFavorite(id); // Remove from favorites
          showAlert("Product removed from your wishlist", "success");
        }}
      />
      {favorites.length > 0 && pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          showInfo={true}
          maxVisiblePages={5}
        />
      )}
      <CustomAlert
        alerts={alerts}
        onClose={(id) => {
          setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }}
      />
    </div>
  );
}
