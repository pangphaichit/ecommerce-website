import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

const CartPage = () => {
  const { userRole, logout, userId } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { cart, getItemCount, updateQuantity, removeFromCart, getCartTotal } =
    useCart();
  const [swipedItem, setSwipedItem] = useState<string | null>(null);
  const [swipeX, setSwipeX] = useState<number>(0);
  const [startX, setStartX] = useState<number | null>(null);
  const swipedRef = useRef<HTMLDivElement | null>(null);

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

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/api/customer/${userId}`);
        setUserName(res.data.data?.first_name);
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch user data");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Cart Page</h1>
        {/* Cart Items */}
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
                onClick={() => router.push("/products")}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div>
              {cart.map((item) => (
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
                    className="flex items-center gap-3 z-10 relative bg-white h-25"
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
                    <div className="w-20 h-24 flex-shrink-0 overflow-hidden ml-4">
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
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-1 hover:text-yellow-600">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-green-600 text-base font-semibold">
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </p>
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
        </div>

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
      </div>
    </div>
  );
};

export default CartPage;
