import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export const useFavoriteProducts = (productIds: string[]) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const url = isAuthenticated
    ? "/api/products/by-ids"
    : "/api/products/by-ids-public";

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          url,
          { productIds },
          isAuthenticated ? { withCredentials: true } : undefined
        );
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch favorite products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productIds]);

  return { products, loading };
};
