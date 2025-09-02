import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductImages from "@/components/product-slug-page-components/ProductImages";
import ProductInfo from "@/components/product-slug-page-components/ProductInfo";
import ProductTabs from "@/components/product-slug-page-components/ProductTabs";
import YouMayAlsoLike from "@/components/product-slug-page-components/YouMayAlsoLike";
import { Bean, Wheat, Egg, Milk, Circle, Frown } from "lucide-react";

export default function ProductSlugPageSection() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Key Features");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const allergenIcons = {
    Nuts: <Bean size={16} className="text-yellow-600" />,
    Gluten: <Wheat size={16} className="text-yellow-600" />,
    Eggs: <Egg size={16} className="text-yellow-600" />,
    Dairy: <Milk size={16} className="text-yellow-600" />,
  };

  useEffect(() => {
    if (!router.isReady || !slug) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
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
  }, [router.isReady, slug]);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error || !slug)
    return (
      <div>
        <Frown /> Product not found
      </div>
    );
  if (!product) return null;

  return (
    <div className="flex flex-col lg:w-[70%] mx-auto w-full gap-2">
      <div className="flex flex-col lg:flex-row mb-4 gap-2">
        <ProductImages
          mainImage={product.image_url}
          images={product.images}
          selectedImageUrl={selectedImageUrl}
          setSelectedImageUrl={setSelectedImageUrl}
        />

        <ProductInfo
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
      <ProductTabs
        product={product}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allergenIcons={allergenIcons}
      />
      <div className="mx-4 mb-4 lg:mb-8 lg:mx-0">
        {product.youMayAlsoLike && product.youMayAlsoLike.length > 0 && (
          <YouMayAlsoLike products={product.youMayAlsoLike} />
        )}
      </div>
    </div>
  );
}
