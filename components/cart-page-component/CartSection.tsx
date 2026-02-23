import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
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
  const router = useRouter();
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
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const gridCols = "grid-cols-[80px_minmax(200px,1.5fr)_1fr_1fr_1fr_80px]";

  const [didSwipe, setDidSwipe] = useState(false);

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    setStartX(e.touches[0].clientX);
    setSwipedItem(id);
    setDidSwipe(false); // reset
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    if (startX === null || swipedItem !== id) return;

    const deltaX = e.touches[0].clientX - startX;

    if (deltaX < -10) {
      setDidSwipe(true); // ✅ mark as swipe
    }

    if (deltaX < 0) {
      setSwipeX(Math.max(deltaX, -100));
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

  const handleCheckout = () => {
    router.push(
      isAuthenticated ? "/customer/my-account/checkout" : "/customer/checkout",
    );
  };

  const handleContinueShopping = () => {
    router.push("/products");
  };

  const showAlert = (
    message: string,
    type: "success" | "error",
    scope: "local" | "global" = "local",
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

  const FREE_SHIPPING_THRESHOLD = 50;
  const cartTotal = getCartTotal();
  const SHIPPING_FEE = 15;
  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : SHIPPING_FEE;
  const finalTotal = cartTotal + shippingFee;

  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD - cartTotal,
    0,
  );

  return (
    <div className="lg:flex lg:gap-8 lg:items-start">
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
          <div className="h-full pb-50 lg:pb-0">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-baseline mb-3">
              <h2 className="text-2xl font-semibold text-yellow-700 leading-tight">
                {isAuthenticated ? "Your Shopping Cart" : "Your Cart"}
              </h2>
              <p className="text-base lg:text-lg text-gray-600 leading-tight">
                {isAuthenticated
                  ? "Review your items before checkout"
                  : "Sign in to view and manage your cart"}
              </p>
              <span className="text-lg font-bold text-yellow-600">
                ({cart.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>
            <div className="relative lg:h-[calc(100vh-220px)] lg:overflow-y-auto">
              <div
                className={`hidden sticky lg:grid ${gridCols} px-5 py-5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-t-lg mt-3 top-0 z-20`}
              >
                <div>Product</div>
                <div className="text-center">Name</div>
                <div>Price</div>
                <div className="pl-6">Quantity</div>
                <div>Sub Total</div>
                <div className="text-end">Delete</div>
              </div>

              {cart.map((item: CartItem) => (
                <div key={item.product_id} className="relative overflow-hidden">
                  <div className="relative hidden lg:block ">
                    <div
                      className={`flex flex-col lg:grid ${gridCols} items-center z-10 relative bg-white border-b border-gray-300 `}
                      onTouchStart={(e) => handleTouchStart(e, item.product_id)}
                      onTouchMove={(e) => handleTouchMove(e, item.product_id)}
                      onTouchEnd={handleTouchEnd}
                      style={{
                        transform:
                          swipedItem === item.product_id
                            ? `translateX(${swipeX}px)`
                            : "translateX(0)",
                        transition:
                          "transform 0.3s cubic-bezier(0.25, 1.5, 0.5, 1)",
                      }}
                    >
                      <div className="w-20 h-28 flex-row overflow-hidden">
                        <Link href={`/products/${item.slug}`}>
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="object-cover w-full h-full hover:border-2 hover:border-yellow-500"
                          />
                        </Link>
                      </div>
                      <div className="w-full pl-8">
                        <Link href={`/products/${item.slug}`}>
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-base  hover:text-yellow-600">
                            {item.name}
                          </h3>
                        </Link>
                        <Button
                          className="flex flex-row w-full justify-start px-0 hover:bg-transparent"
                          variant="ghost"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              if (isFavorite(item.product_id)) {
                                await removeFavorite(item.product_id);
                                showAlert(
                                  "Removed from favorites",
                                  "success",
                                  "local",
                                );
                              } else {
                                await addFavorite(item.product_id);
                                // Show different message for guest vs logged-in
                                if (isAuthenticated) {
                                  removeFromCart(item.product_id);
                                  showAlert(
                                    "Added to favorites!",
                                    "success",
                                    "local",
                                  );
                                } else {
                                  removeFromCart(item.product_id);
                                  showAlert(
                                    "Added to favorites! Log in to sync",
                                    "success",
                                    "local",
                                  );
                                }
                              }
                            } catch (err) {
                              console.error("Error updating favorites:", err);
                              showAlert("Failed to update favorite", "error");
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Heart
                              className={`transition-colors duration-200 ${
                                isFavorite(item.product_id)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill={
                                isFavorite(item.product_id)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                            <span>
                              {isFavorite(item.product_id)
                                ? "In favorites"
                                : "Save for later"}
                            </span>
                          </div>
                        </Button>
                      </div>

                      <p>${item.price || 0}</p>

                      <div className="flex">
                        <div className="flex flex-row gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product_id,
                                Math.max(0, item.quantity - 1),
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
                      </div>
                      <div className="text-green-600 text-base font-semibold">
                        {" "}
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => removeFromCart(item.product_id)}
                        className="rounded-full transition-colors duration-200 cursor-pointer"
                        aria-label="Remove from cart"
                      >
                        <Trash2
                          size={18}
                          className="hidden lg:block text-gray-500"
                        />
                      </Button>
                    </div>
                  </div>

                  {/* mobile  */}
                  <div className="block lg:hidden w-full mb-4">
                    {/* Red background */}
                    {swipedItem === item.product_id && (
                      <div
                        className="absolute inset-y-0 right-0 w-24 h-35 bg-red-600 flex justify-center items-center z-0"
                        ref={swipedRef}
                        onClick={() => {
                          removeFromCart(item.product_id);
                          setSwipeX(0);
                          setSwipedItem(null);
                        }}
                      >
                        <Trash2
                          size={20}
                          className="text-white ml-2"
                          style={{
                            transform:
                              swipedItem === item.product_id
                                ? `translateX(${swipeX / 22}px)`
                                : "translateX(0)",
                          }}
                        />
                      </div>
                    )}

                    <div
                      key={item.product_id}
                      ref={(el) => {
                        if (el) {
                          cardRefs.current[item.product_id] = el;
                        }
                      }}
                      className="flex items-center gap-3 z-10 relative bg-white h-35"
                      onTouchStart={(e) => handleTouchStart(e, item.product_id)}
                      onTouchMove={(e) => handleTouchMove(e, item.product_id)}
                      onTouchEnd={handleTouchEnd}
                      style={{
                        transform:
                          swipedItem === item.product_id
                            ? `translateX(${swipeX}px)`
                            : "translateX(0)",
                        transition:
                          "transform 0.3s cubic-bezier(0.25, 1.5, 0.5, 1)",
                      }}
                    >
                      <div className="w-20 h-28 flex-shrink-0 overflow-hidden">
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

                        <Button
                          className="p-0"
                          variant="ghost"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              if (isFavorite(item.product_id)) {
                                await removeFavorite(item.product_id);
                                showAlert(
                                  "Removed from favorites",
                                  "success",
                                  "local",
                                );
                              } else {
                                await addFavorite(item.product_id);
                                // Show different message for guest vs logged-in
                                if (isAuthenticated) {
                                  removeFromCart(item.product_id);
                                  showAlert(
                                    "Added to favorites!",
                                    "success",
                                    "local",
                                  );
                                } else {
                                  removeFromCart(item.product_id);
                                  showAlert(
                                    "Added to favorites! Log in to sync",
                                    "success",
                                    "local",
                                  );
                                }
                              }
                            } catch (err) {
                              console.error("Error updating favorites:", err);
                              showAlert("Failed to update favorite", "error");
                            }
                          }}
                        >
                          <div className="flex flex-row gap-2">
                            <Heart
                              className={`transition-colors duration-200 ${
                                isFavorite(item.product_id)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill={
                                isFavorite(item.product_id)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                            <span>
                              {isFavorite(item.product_id)
                                ? "In favorites"
                                : "Save for later"}
                            </span>
                          </div>
                        </Button>

                        <p className="text-green-600 text-base font-semibold">
                          ${((item.price || 0) * item.quantity).toFixed(2)}
                        </p>

                        <div className="flex justify-between items-center gap-2 mt-2">
                          <div className="flex flex-row gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  Math.max(0, item.quantity - 1),
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
                                updateQuantity(
                                  item.product_id,
                                  item.quantity + 1,
                                )
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart Footer for mobile only*/}
        {cart.length > 0 && (
          <div className="block lg:hidden fixed lg:left-1/2 lg:-translate-x-1/2  bottom-0 left-0 right-0  w-full bg-white lg:py-4 max-w-xl p-3  z-40">
            {/* Free shipping message */}
            {cartTotal < FREE_SHIPPING_THRESHOLD ? (
              <p className="text-sm text-gray-600 text-center mb-2">
                Spend{" "}
                <span className="font-semibold text-yellow-600">
                  ${remainingForFreeShipping.toFixed(2)}
                </span>{" "}
                more to get <span className="font-semibold">FREE shipping</span>
              </p>
            ) : (
              <p className="text-sm text-green-600 font-medium text-center mb-2">
                🎉 You’ve unlocked{" "}
                <span className="font-semibold">FREE shipping</span>
              </p>
            )}
            <div className="flex justify-between">
              <span className="text-base">
                Subtotal ({cart.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
              <span className="text-base font-semibold">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-base">
                <span className="text-base">Delivery</span>
                <span>
                  {" "}
                  {isFreeShipping ? (
                    <span className="text-green-600 text-base">FREE</span>
                  ) : (
                    <span className="text-base font-semibold">
                      {" "}
                      ${shippingFee.toFixed(2)}
                    </span>
                  )}
                </span>
              </div>
              <hr />
              <span className="text-xl font-semibold">Total: </span>
              <span className="text-xl font-bold text-yellow-600">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Button
                onClick={handleCheckout}
                className="min-w-80 rounded-full w-full text-lg"
              >
                Checkout
              </Button>
              <Button
                variant="ghost"
                onClick={handleContinueShopping}
                className="min-w-80 rounded-full w-full underline text-base text-center text-gray-600 hover:text-yellow-600  transition-colors"
              >
                Continue shopping
              </Button>
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

      {/* Order Summary — desktop only */}
      <div className="hidden lg:block w-80 flex-shrink-0 sticky top-6 mt-14">
        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-5">
            Order Summary
          </h3>
          {/* Free shipping message */}
          {cartTotal < FREE_SHIPPING_THRESHOLD ? (
            <p className="text-[0.8rem] text-gray-600 text-center mb-5">
              Spend{" "}
              <span className="font-semibold text-yellow-600">
                ${remainingForFreeShipping.toFixed(2)}
              </span>{" "}
              more to get <span className="font-semibold">FREE shipping</span>
            </p>
          ) : (
            <p className="text-sm text-green-600 font-medium text-center mb-5">
              🎉 You’ve unlocked{" "}
              <span className="font-semibold">FREE shipping</span>
            </p>
          )}
          <div className="space-y-3 text-lg text-gray-600">
            <div className="flex justify-between">
              <span>
                Subtotal ({cart.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
              <span className="font-medium text-gray-800">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span className="font-medium">
                {" "}
                {isFreeShipping ? (
                  <span className="text-green-600 text-base">FREE</span>
                ) : (
                  <span className="text-base"> ${shippingFee.toFixed(2)}</span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-medium text-gray-800">—</span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4" />

          <div className="flex justify-between items-center mb-5">
            <span className="text-base font-bold text-gray-800">Total</span>
            <span className="text-xl font-bold text-yellow-600">
              ${finalTotal.toFixed(2)}
            </span>
          </div>

          <Button onClick={handleCheckout} className="rounded-full w-full">
            Checkout
          </Button>

          <Link
            href="/products"
            className="block text-center text-sm text-gray-600 hover:text-yellow-600 mt-3 transition-colors underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSection;
