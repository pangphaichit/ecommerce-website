import { useEffect, useState } from "react";
import NewArrivalCarousel from "@/components/landing-page-components/NewArrivalCarousel";
import SkeletonNewArrival from "@/components/ui/SkeletonNewArrival";
import axios from "axios";

export default function NewArrivalSection() {
  const [products, setProducts] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/api/products?limit=8&sort=newest");
        console.log(res.data);
        setProducts(res.data.product || []);
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
        setError("Failed to load new arrivals.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (error)
    return <div className="text-red-500 text-center my-4">{error}</div>;

  return (
    <>
      {loading ? (
        <SkeletonNewArrival />
      ) : (
        <NewArrivalCarousel products={products} />
      )}
    </>
  );
}
