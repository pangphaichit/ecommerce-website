import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";

type Product = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  price: number;
};

const ProductSlugPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !product)
    return <div className="p-8 text-center text-red-600">No product found</div>;

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <NotificationBar />
      <Navbar />
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <Image
          src={product.image_url}
          alt={product.name}
          width={150}
          height={150}
          className="rounded-xl"
        />
        <p className="text-lg mt-4">{product.description}</p>
        <p className="text-xl font-semibold text-green-600">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductSlugPage;
