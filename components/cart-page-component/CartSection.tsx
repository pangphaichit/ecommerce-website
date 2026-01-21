import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import { CartItem } from "@/types/context/";
import CustomAlert from "@/components/ui/CustomAlert";
import { Product } from "@/types/products";
import { AlertItem } from "@/types/ui";

interface CartSectionProps {
  isGuest?: boolean;
}

const CartSection: React.FC<CartSectionProps> = ({ isGuest = false }) => {
  const { isAuthenticated } = useAuth();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    loading: favLoading,
  } = useFavorites();
  const [swipedItem, setSwipedItem] = useState<string | null>(null);
  const [swipeX, setSwipeX] = useState<number>(0);
  const [startX, setStartX] = useState<number | null>(null);
  const swipedRef = useRef<HTMLDivElement | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    setStartX(e.touches[0].clientX);
    setSwipedItem(id);
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    if (startX === null || swipedItem !== id) return;

    const deltaX = e.touches[0].clientX - startX;
    if (deltaX < 0) {
      setSwipeX(Math.max(deltaX, -100)); // limit left swipe
    }
  };

  const handleTouchEnd = () => {
    if (swipeX < -50) {
      setSwipeX(-100);
    } else {
      setSwipeX(0);
      setSwipedItem(null);
    }
    setStartX(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        swipedRef.current &&
        !swipedRef.current.contains(event.target as Node)
      ) {
        setSwipeX(0);
        setSwipedItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [swipedRef]);

  return (
    <div className="flex-1 overflow-y-auto">
      {cart.length === 0 ? (
        <div className="text-center py-8 flex flex-col gap-2 px-7">
          <ShoppingCart size={48} className="mx-auto text-gray-300" />
          <p className="text-gray-500 text-lg font-semibold">
            Your cart is empty.
          </p>
          <Button
            variant="yellow"
            className="rounded-full py-5 mt-4 text-base"
            onClick={() => (window.location.href = "/products")}
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-semibold mb-4">
            {isAuthenticated ? "Your Shopping Cart" : "Your Cart"}
          </h1>
          {cart.map((item: CartItem) => (
            <div
              key={item.product_id}
              className="relative w-full mb-4 overflow-hidden"
            >
              {/* Red background */}
              <div className="absolute top-0 right-0 bottom-0 left-0  flex flex-row justify-end items-center z-0">
                <div className="bg-white"></div>
                <div
                  className=" bg-red-600 h-24 w-25 pl-2 flex justify-center items-center"
                  ref={swipedRef}
                  onClick={() => removeFromCart(item.product_id)}
                >
                  <Trash2
                    size={20}
                    className="text-white"
                    style={{
                      transform:
                        swipedItem === item.product_id
                          ? `translateX(${swipeX / 22}px)`
                          : "translateX(0)",
                    }}
                  />
                </div>
              </div>
              <div
                key={item.product_id}
                className="flex items-center gap-3 z-10 relative bg-white h-40"
                onTouchStart={(e) => handleTouchStart(e, item.product_id)}
                onTouchMove={(e) => handleTouchMove(e, item.product_id)}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform:
                    swipedItem === item.product_id
                      ? `translateX(${swipeX}px)`
                      : "translateX(0)",
                  transition: "transform 0.3s cubic-bezier(0.25, 1.5, 0.5, 1)",
                }}
              >
                <div className="w-20 h-28 flex-shrink-0 overflow-hidden ml-2">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="object-cover  w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="block w-full"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-1 hover:text-yellow-600">
                      {item.name}
                    </h3>
                  </Link>

                  <p className="text-green-600 text-base font-semibold">
                    ${((item.price || 0) * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    className="flex flex-col"
                    variant="ghost"
                    size="icon-sm"
                    onClick={async (e) => {
                      removeFromCart(item.product_id);
                      e.stopPropagation();
                      try {
                        if (isFavorite(item.product_id)) {
                          await removeFavorite(item.product_id);
                          showAlert(
                            "Removed from favorites",
                            "success",
                            "local"
                          );
                        } else {
                          await addFavorite(item.product_id);
                          // Show different message for guest vs logged-in
                          if (isAuthenticated) {
                            showAlert(
                              "Added to favorites!",
                              "success",
                              "local"
                            );
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
                    <div className="flex flex-row w-30">
                      <Heart
                        className={`transition-colors duration-200 ${
                          isFavorite(item.product_id)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill={
                          isFavorite(item.product_id) ? "currentColor" : "none"
                        }
                      />
                      <span>Save for later</span>
                    </div>
                  </Button>
                  <div className="flex justify-between items-center gap-2 mt-2">
                    <div className="flex flex-row gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            Math.max(0, item.quantity - 1)
                          )
                        }
                        className="p-3 rounded-full text-gray-700 border-none  hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="flex justify-center text-sm font-medium w-4 text-center items-center text-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity + 1)
                        }
                        className="p-3 rounded-full text-gray-700 border-none hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="ml-2 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 mr-4  cursor-pointer"
                      aria-label="Remove from cart"
                    >
                      <Trash2
                        size={18}
                        className="hidden lg:block text-gray-500"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Footer */}
      {cart.length > 0 && (
        <div className="pt-4 px-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold text-yellow-600">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
        </div>
      )}
      <CustomAlert
        alerts={alerts}
        onClose={(id) => {
          setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }}
      />
    </div>
  );
};

export default CartSection;
