import Image from "next/image";
import { useRouter } from "next/router";
import { Heart } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

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

interface ProductListProps {
  products: Product[];
  isFiltering?: boolean;
  onClearFilters?: () => void;
}

export default function ProductList({
  products,
  isFiltering = false,
  onClearFilters,
}: ProductListProps) {
  const router = useRouter();

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  const validProducts = products.filter(Boolean);

  if (validProducts.length === 0) {
    return (
      <div className="w-full max-w-[93%] lg:max-w-[95%] mx-auto">
        <div className="flex flex-col items-center justify-center py-16 text-center">

          <div className="relative w-25 h-25 mb-4 opacity-60">

            <Image
              src="/products/bakerybag.png"
              alt="No products found"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg lg:text-2xl font-medium text-gray-500 mb-2">
            No Products Found
          </h3>
          <p className="text-base lg:text-lg text-gray-400 mb-6">
            {isFiltering
              ? "No products match your current filters. Try adjusting your search."
              : "No products are available right now. Please check back later!"}
          </p>
          {isFiltering && onClearFilters && (
            <Button variant="yellow" onClick={onClearFilters} className="px-6">
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[93%] lg:max-w-[95%] mx-auto grid gap-4 grid-cols-1 lg:grid-cols-3">
      {validProducts.map((product) => (
        <div
          key={product.product_id}
          className="group border border-gray-200 rounded-xl overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => handleProductClick(product.slug)}
        >
          <div className="relative h-52 bg-gray-100">
            {!product.is_available && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gray-500 bg-opacity-30" />
                <Badge
                  variant="destructive"
                  className="text-sm z-30 flex items-center justify-center"
                >
                  Out of Stock
                </Badge>
              </div>
            )}

            <Image
              src={`${product.image_url}?t=${Date.now()}`}
              alt={product.name}
              className={`relative h-full w-full object-cover transition-all duration-200 ${
                !product.is_available ? "grayscale opacity-50" : ""
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              width={400}
              height={300}
            />
          </div>

          <div className="p-4 relative">
            <h3 className="font-bold text-[0.95rem] text-yellow-600 truncate">
              {product.name}
            </h3>

            <p className="mt-2 text-sm text-gray-600 h-14 overflow-hidden">
              {product.description.length > 120
                ? product.description.slice(0, 120) + "..."
                : product.description}
            </p>

            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="yellow"
                className="flex-1 rounded-full text-xs"
                disabled={!product.is_available}
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Add ${product.name} to cart!`);
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Favorite ${product.name}!`);
                }}
              >
                <Heart className="text-yellow-500" />
              </Button>
            </div>

            <span className="text-[0.95rem] font-semibold absolute top-4 right-4 text-green-600">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
