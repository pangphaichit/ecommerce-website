import Image from "next/image";
import React from "react";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useFavoriteProducts } from "@/hooks/useFavoriteProducts";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const { isAuthenticated, logout, userId } = useAuth();
  const { favorites, removeFavorite, loading } = useFavorites();
   const productIds = useMemo(
  () => favorites.map((f) => f.product_id),
  [favorites]
);

  const { products, loading: productsLoading } =
    useFavoriteProducts(productIds);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl lg:text-2xl font-semibold">My Favourites</h2>
        <p className="text-base lg:text-lg  mt-2 text-gray-600">
          {isAuthenticated
            ? "Your curated favorites, all in one place"
            : "Start building your favorites collection—sign in now!"}
        </p>
        <p>Loading your favourites...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="px-4 lg:px-8 ">
        <div className=" lg:mt-8 lg:bg-gray-100 my-4 lg:p-4 lg:rounded-2xl flex flex-col lg:flex-row gap-3 items-start lg:items-center lg:mb-2">
          <h2 className="text-xl lg:text-2xl font-semibold ">
            {isAuthenticated ? "Yoir wishlist" : "Wishlist"}
          </h2>
          <p className="text-base lg:text-lg  text-gray-600">
            {isAuthenticated
              ? "Your curated favorites, all in one place"
              : "Sign in to save and view your favorites"}
          </p>
        </div>
        <div className="flex flex-col items-center p-4 lg:p-8">
          <div className="relative flex w-22 h-22 mb-4 opacity-60">
            <Image
              src={"/products/bakerybag.png"}
              alt="No favourite found"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg lg:text-2xl font-medium text-gray-500 mb-2">
            You haven’t added any favourites yet.
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Favourites</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((item) => (
          <li
            key={item.product_id}
            className="border rounded-lg p-4 flex flex-col justify-between"
          >
            <div>
             <div className="relative h-20 w-full">
              <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover rounded-md"
          />
          </div>
              <h2 className="font-semibold text-lg">{item.product_id}</h2>
              <p className="text-sm text-gray-500">
                Added at:{" "}
                {item.added_at ? new Date(item.added_at).toLocaleString() : "-"}
              </p>
            </div>
            <button
              className="mt-4 text-red-500 hover:underline"
              onClick={() => removeFavorite(item.product_id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
