import { useEffect, useState } from "react";
import ProductsCarousel from "@/components/landing-page-components/ProductsCarousel";
import SkeletonProductsCarousel from "@/components/ui/SkeletonProductsCarousel";
import axios from "axios";
import { Product } from "@/types/products";

export default function BestSellingSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/api/products/best-selling");
        setProducts(res.data.product || []);
      } catch (err) {
        console.error("Failed to fetch best selling products:", err);
        setError("Failed to load best selling products.");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSelling();
  }, []);

  if (error)
    return <div className="text-red-500 text-center my-4">{error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-center lg:text-start lg:ml-[3%]">
        Best Selling
      </h2>
      {loading ? (
        <SkeletonProductsCarousel />
      ) : (
        <ProductsCarousel products={products} />
      )}
    </div>
  );
}
