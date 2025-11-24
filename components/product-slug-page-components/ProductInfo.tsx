import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart, Store, Truck, Star, Minus, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AddToCartDialog from "@/components/product-slug-page-components/AddToCartDialog";
import CustomAlert from "@/components/ui/CustomAlert";
import { AlertItem } from "@/types/ui";

interface Props {
  product: any;
  quantity: number;
  setQuantity: (q: number) => void;
  price: number;
}

export default function ProductInfo({ product, quantity, setQuantity }: Props) {
  const { isAuthenticated } = useAuth();
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    loading: favLoading,
  } = useFavorites();
  const { addToCart } = useCart();
  const [showDialog, setShowDialog] = useState(false);
  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(Math.max(1, quantity - 1));
  // State for stacked alerts
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const handleAddToCart = () => {
    if (product.is_available) {
      addToCart(product, quantity);
      setShowDialog(true);

      // Auto-close dialog after 5 seconds
      setTimeout(() => {
        setShowDialog(false);
      }, 3000);
    }
  };

  const showAlert = (
    message: string,
    type: "success" | "error",
    scope: "local" | "global" = "local"
  ) => {
    if (scope === "local") {
      const id = Date.now() + Math.random();

      setAlerts((prev) => [{ id, message, type }, ...prev]);
    } else {
      console.warn("Global alert triggered:", message);
    }
  };

  return (
    <div className="lg:w-[50%]">
      {/* Badges */}
      <div className="flex flex-wrap gap-2 my-2 items-center justify-center lg:justify-start lg:ml-4">
        {product.isBestSelling && <Badge variant="warning">Best Selling</Badge>}
        {product.isNewArrival && <Badge variant="success">New Arrival</Badge>}
        {product.online_exclusive && (
          <Badge variant="secondary">Online Exclusive</Badge>
        )}
      </div>
      <div className="flex flex-col gap-4 mx-4 lg:ml-4 lg:mr-0">
        <div className="flex justify-between items-center lg:mt-0">
          <h1 className="text-[1.1rem] lg:text-2xl font-semibold text-center">
            {product.name}
          </h1>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                if (isFavorite(product.product_id)) {
                  await removeFavorite(product.product_id);
                  showAlert("Removed from favorites", "success", "local");
                } else {
                  await addFavorite(product.product_id);
                  // Show different message for guest vs logged-in
                  if (isAuthenticated) {
                    showAlert("Added to favorites!", "success", "local");
                  } else {
                    showAlert(
                      "Added to favorites! Log in to sync",
                      "success",
                      "local"
                    );
                  }
                }
              } catch (err) {
                console.error("Error updating favorites:", err);
                showAlert("Failed to update favorite", "error");
              }
            }}
          >
            <Heart
              size={18}
              className={`transition-colors duration-200 ${
                isFavorite(product.product_id)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              fill={isFavorite(product.product_id) ? "currentColor" : "none"}
            />
          </Button>
        </div>
        <p className="text-base lg:text-lg">
          {" "}
          {product.description?.slice(0, 250)}
          {product.description && product.description.length > 250 ? "…" : ""}
        </p>

        {/* Quantity + Price */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="lightyellow"
              className="rounded-full p-3"
              onClick={decrement}
            >
              <Minus size={15} />
            </Button>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-12 text-center border border-gray-300"
              readOnly
            />
            <Button
              variant="lightyellow"
              className="rounded-full p-3"
              onClick={increment}
            >
              <Plus size={15} />
            </Button>
          </div>
          <p className="text-xl font-semibold text-green-600">
            ${Number(product.price ?? 0).toFixed(2)}
          </p>
        </div>

        {/* Add to Cart / Notify Me */}
        <Button
          variant={product.is_available ? "yellow" : "secondary"}
          className="w-full py-6 rounded-full"
          onClick={handleAddToCart}
        >
          {product.is_available ? "Add to Cart" : "Notify Me"}
        </Button>

        {/* Delivery info */}
        <div className="lg:mt-2 space-y-4">
          <div className="flex gap-2 items-center">
            {product.online_exclusive ? (
              <Star size={19} className="text-yellow-700" />
            ) : (
              <Store size={18} className="text-yellow-700" />
            )}
            <p className="text-[0.9rem] text-yellow-700 font-medium">
              {product.online_exclusive
                ? "Exclusively Online, Get it delivered anywhere, anytime!"
                : "Click & Collect Available"}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Truck size={18} className="text-green-700" />
            <p className="text-[0.9rem] text-green-700 font-medium">
              Free shipping on orders over $50!
            </p>
          </div>
        </div>
      </div>
      {/* the dialog component */}
      <AddToCartDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        productName={product.name}
        productImage={product.image_url}
        quantity={quantity}
        price={Number(product.price ?? 0)}
      />
      <CustomAlert
        alerts={alerts}
        onClose={(id) => {
          setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }}
      />
    </div>
  );
}
