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
import CartSection from "@/components/cart-page-component/CartSection";

const CartPage = () => {
   const { userId, logout } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`/api/customer/${userId}`);
        setUserName(res.data.data?.first_name);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [userId]);

  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <CartSection />
      </div>
    </div>
  );
};


export default CartPage;
