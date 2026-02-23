import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Wheat,
  Milk,
  Bean,
  Egg,
} from "lucide-react";
import Button from "@/components/ui/Button";
import DrawerPanel from "@/components/DrawerPanel";
import AddToCartDialog from "@/components/product-slug-page-components/AddToCartDialog";
import CustomAlert from "@/components/ui/CustomAlert";

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
  const { addToCart } = useCart();
  const { isFavorite } = useFavorites();
  const [selectedProduct, setSelectedProduct] =
    useState<FavoriteProduct | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  const openQuickPurchase = async (
    e: React.MouseEvent,
    product: FavoriteProduct,
  ) => {
    e.stopPropagation();

    try {
      const { data: response } = await axios.get(
        `/api/products/${product.slug}`,
      );
      setSelectedProduct(response.data); // response.data is the actual product
    } catch {
      setSelectedProduct({ ...product, allergens: [], description: "" } as any);
    }

    setSelectedQuantity(1);
    setIsDrawerOpen(true);
  };

  const handleAddToCartFromDrawer = (
    product: FavoriteProduct,
    quantity: number,
  ) => {
    addToCart({ ...product, price: Number(product.price) }, quantity);
    setSelectedProduct(product);
    setIsDrawerOpen(false);
    setShowDialog(true);
    setTimeout(() => setShowDialog(false), 3000);
  };

  const allergenIcons = {
    Nuts: <Bean size={16} className="text-yellow-600" />,
    Gluten: <Wheat size={16} className="text-yellow-600" />,
    Eggs: <Egg size={16} className="text-yellow-600" />,
    Dairy: <Milk size={16} className="text-yellow-600" />,
  };

  return (
    <div className="drawer drawer-end">
      {/* Drawer toggle input */}
      <input
        id="cart-drawer"
        type="checkbox"
        className="drawer-toggle hidden"
      />
      {isDrawerOpen && (
        <label
          htmlFor="cart-drawer"
          className="drawer-overlay fixed top-0 left-0 w-screen h-screen bg-black/50  z-50"
          onClick={() => setIsDrawerOpen(false)}
        ></label>
      )}

      {/* Drawer content */}

      <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 my-2 lg:my-4 drawer-content drawer">
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
                    onClick={(e) => openQuickPurchase(e, item)}
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
      {selectedProduct && (
        <DrawerPanel
          selectedProduct={selectedProduct as any} // cast if DrawerPanel expects full Product type
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          selectedQuantity={selectedQuantity}
          setSelectedQuantity={setSelectedQuantity}
          handleAddToCartFromDrawer={(product, quantity) =>
            handleAddToCartFromDrawer(product as FavoriteProduct, quantity)
          }
          allergenIcons={allergenIcons}
          tabContent={{
            Ingredients: "No ingredients info",
            Allergens: "No allergens info",
          }}
        />
      )}

      {selectedProduct && (
        <AddToCartDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          productName={selectedProduct.name}
          productImage={selectedProduct.image_url}
          quantity={selectedQuantity}
          price={Number(selectedProduct.price ?? 0)}
        />
      )}
    </div>
  );
}
