import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart } from "lucide-react";
import Button from "@/components/ui/Button";

interface FavoriteProduct {
  product_id: string;
  name: string;
  price: number | null;
  slug: string;
  image_url: string;
  added_at?: string;
}

interface Props {
  products: FavoriteProduct[];
  removeFavorite: (id: string) => void;
}

export default function FavoriteProductsList({
  products,
  removeFavorite,
}: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    favorites,
    addFavorite,
    isFavorite,
    loading: favLoading,
  } = useFavorites();

  // wip const [selectedFilter, setSelectedFilter] = useState("newest");

  console.log(products);
  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 my-2 lg:my-4">
      {products.map((item) => (
        <div
          onClick={() => handleProductClick(item.slug)}
          key={item.product_id}
          className="drawer-content drawer cursor-pointer group border border-gray-200 rounded-xl overflow-hidden relative hover:shadow-lg transition-shadow duration-200"
        >
          <div className="relative h-25 lg:h-52 bg-gray-100">
            <Image
              src={`${item.image_url}?t=${Date.now()}`}
              alt={item.name}
              className="relative h-full w-full object-cover transition-all duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              width={400}
              height={300}
            />
          </div>

          <div className="p-4 relative">
            <div className="flex flex-col lg:flex-row justify-between">
              <h3 className="font-bold text-[0.95rem] text-yellow-600 truncate">
                {item.name}
              </h3>

              <span className="text-[0.95rem] font-semibold  text-green-600">
                ${Number(item.price).toFixed(2)}
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <label htmlFor="cart-drawer" className="cursor-pointer w-full">
                <Button
                  size="sm"
                  variant="yellow"
                  className="flex-1 rounded-full text-xs w-full"
                >
                  Add to Cart
                </Button>
              </label>
              <Button variant="ghost" size="icon-sm">
                <Heart
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(item.product_id);
                  }}
                  className={`transition-colors duration-200 ${
                    isFavorite(item.product_id)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill={isFavorite(item.product_id) ? "currentColor" : "none"}
                />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </ul>
  );
}
