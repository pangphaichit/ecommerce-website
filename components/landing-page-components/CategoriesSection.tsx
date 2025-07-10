import { useEffect, useState } from "react";
import CategoriesCarousel from "@/components/landing-page-components/CategoriesCarousel";
import SkeletonCategories from "@/components/ui/SkeletonCategories";
import axios from "axios";

interface Category {
  category_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  image_url: string | null;
}

export default function CategoriesDisplay() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/api/products/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center my-4">{error}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-center lg:text-start lg:ml-[3%]">
        Shop by Category
      </h2>
      {loading ? <SkeletonCategories /> : <CategoriesCarousel />}
    </div>
  );
}
