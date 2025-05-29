import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";

type Product = {
  product_id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  slug: string;
};

const CategorySlugPage: React.FC = () => {
  const router = useRouter();
  const { category_slug, slug } = router.query;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  useEffect(() => {
    if (!category_slug) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`/api/products`, {
          params: { category_slug },
        });
        setProducts(res.data.product || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category_slug]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load products
      </div>
    );
  if (products.length === 0)
    return (
      <div className="p-8 text-center">No products found in this category</div>
    );

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <NotificationBar />
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">
        Products in category: {category_slug}
      </h1>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <li
            key={product.product_id}
            className="border p-4 rounded-lg"
            onClick={() => handleProductClick(product.slug)}
          >
            <img
              src={product.image_url}
              alt={product.name}
              width={150}
              height={150}
              className="rounded-md object-cover mb-3"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-sm mb-2">{product.description}</p>
            <p className="text-green-600 font-bold">
              {Number(product.price).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySlugPage;
