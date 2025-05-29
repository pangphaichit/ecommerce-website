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
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4 text-center lg:text-start lg:ml-[3%]">
        New Arrivals
      </h2>
      {loading ? (
        <SkeletonNewArrival />
      ) : (
        <NewArrivalCarousel products={products} />
      )}
    </div>
  );
}
