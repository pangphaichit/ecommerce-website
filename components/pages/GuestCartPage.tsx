import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import {
  Menu,
  X,
  Search,
  Heart,
  User,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import CartSection from "@/components/cart-page-component/CartSection";

const GuestCartPage = () => {


  

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

export default GuestCartPage;
