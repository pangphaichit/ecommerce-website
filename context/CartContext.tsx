import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  slug: string;
}

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemDetails: (
    productId: string,
    details: Partial<CartItem>
  ) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, userId, loading: authIsLoading } = useAuth();

  // 🟢 Load cart on auth ready
  useEffect(() => {
    if (authIsLoading) return;

    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated && userId) {
          const { data: dbCart } = await axios.get("/api/cart");

          setCart(dbCart);
        } else {
          const guestCart = sessionStorage.getItem("guest-cart");
          setCart(guestCart ? JSON.parse(guestCart) : []);
        }
      } catch (err) {
        console.error("Error loading cart:", err);
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, userId, authIsLoading]);

  // 🟡 Save guest cart
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      sessionStorage.setItem("guest-cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated, isLoading]);

  // 🟣 Merge guest cart after login
  useEffect(() => {
    if (isAuthenticated && userId && !authIsLoading) {
      mergeGuestCart();
    }
  }, [isAuthenticated, userId, authIsLoading]);

  const mergeGuestCart = async () => {
    const guestData = sessionStorage.getItem("guest-cart");
    if (!guestData) return;

    const guestCart: CartItem[] = JSON.parse(guestData);
    if (guestCart.length === 0) return;

    try {
      // Add each guest cart item to the database via API
      await Promise.all(
        guestCart.map((item) =>
          axios.post("/api/cart", {
            product_id: item.product_id,
            quantity: item.quantity,
          })
        )
      );

      // ✅ Reload merged cart from API (includes product info)
      const { data: dbCart } = await axios.get("/api/cart");
      setCart(dbCart);

      sessionStorage.removeItem("guest-cart");
    } catch (error) {
      console.error("Error merging guest cart:", error);
    }
  };

  // 🔹 Core actions
  const addToCart = async (
    product: Omit<CartItem, "quantity">,
    qty: number = 1
  ) => {
    const newCart = [...cart];
    const index = newCart.findIndex((i) => i.product_id === product.product_id);

    if (index >= 0) newCart[index].quantity += qty;
    else newCart.push({ ...product, quantity: qty });

    setCart(newCart);

    if (isAuthenticated && userId) {
      try {
        await axios.post("/api/cart", {
          product_id: product.product_id,
          quantity: qty,
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
        setCart(cart);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    const oldCart = [...cart];
    const newCart = cart.filter((i) => i.product_id !== id);
    setCart(newCart);

    if (isAuthenticated) {
      try {
        await axios.delete("/api/cart", { data: { product_id: id } });
      } catch (error) {
        console.error("Error removing from cart:", error);
        setCart(oldCart);
      }
    }
  };

  const updateQuantity = async (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);

    const oldCart = [...cart];
    const newCart = cart.map((i) =>
      i.product_id === id ? { ...i, quantity: qty } : i
    );
    setCart(newCart);

    if (isAuthenticated) {
      try {
        await axios.put("/api/cart", { product_id: id, quantity: qty });
      } catch (error) {
        console.error("Error updating quantity:", error);
        setCart(oldCart);
      }
    }
  };

  const updateItemDetails = async (id: string, details: Partial<CartItem>) => {
    const newCart = cart.map((i) =>
      i.product_id === id ? { ...i, ...details } : i
    );
    setCart(newCart);
  };

  const clearCart = async () => {
    const oldCart = [...cart];
    setCart([]);
    sessionStorage.removeItem("guest-cart");

    if (isAuthenticated) {
      try {
        await Promise.all(
          oldCart.map((item) =>
            axios.delete("/api/cart", { data: { product_id: item.product_id } })
          )
        );
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  // 💰 Helpers
  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getItemCount = () =>
    cart.reduce((count, item) => count + item.quantity, 0);

  const isInCart = (id: string) => cart.some((i) => i.product_id === id);
  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemDetails,
        clearCart,
        getCartTotal,
        getItemCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
