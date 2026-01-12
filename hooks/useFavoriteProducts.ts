import { useEffect, useState } from "react";
import axios from "axios";

export const useFavoriteProducts = (productIds: string[]) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post("/api/products/by-ids", {
         productIds,
        });
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
