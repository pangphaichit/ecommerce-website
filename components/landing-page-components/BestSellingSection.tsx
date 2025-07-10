import { useEffect, useState } from "react";
import ProductsCarousel from "@/components/landing-page-components/ProductsCarousel";
import SkeletonProductsCarousel from "@/components/ui/SkeletonProductsCarousel";
import axios from "axios";

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number | null;
  is_available: boolean;
  category_id: number | null;
  size: string;
  ingredients: string;
  allergens: string;
  nutritional_info: string;
  seasonal: string;
  collection: string;
  stock_quantity: number;
  min_order_quantity: number;
  image_url: string;
  slug: string;
  image_file?: File;
}

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
