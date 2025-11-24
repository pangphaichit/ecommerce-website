import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface FavoriteItem {
  product_id: string;
  added_at?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (product_id: string) => Promise<void>;
  removeFavorite: (product_id: string) => Promise<void>;
  isFavorite: (product_id: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};

const GUEST_STORAGE_KEY = "guestFavorites";

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites (server or guest)
  useEffect(() => {
    if (authLoading) return;

    const loadFavorites = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const { data } = await axios.get("/api/favorites");
          setFavorites(data);
        } else {
          const guestFavs = localStorage.getItem(GUEST_STORAGE_KEY);
          setFavorites(guestFavs ? JSON.parse(guestFavs) : []);
        }
      } catch (err) {
        console.error("Error loading favorites:", err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated, authLoading]);

  // Migrate guest favorites to server when logging in
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const migrateGuestFavorites = async () => {
      const guestFavs = localStorage.getItem(GUEST_STORAGE_KEY);
      if (!guestFavs) return;

      try {
        const items: FavoriteItem[] = JSON.parse(guestFavs);
        const productIds = items.map((item) => item.product_id);
        if (productIds.length > 0) {
          await axios.post("/api/favorites/bulk", { products: productIds });
          localStorage.removeItem(GUEST_STORAGE_KEY);
          const { data } = await axios.get("/api/favorites");
          setFavorites(data);
        }
      } catch (err) {
        console.error("Error migrating guest favorites:", err);
      }
    };

    migrateGuestFavorites();
  }, [isAuthenticated, authLoading]);

  // Add a favorite (handles guest & user)
  const addFavorite = async (product_id: string) => {
    if (favorites.some((f) => f.product_id === product_id)) return;

    const newFavorite: FavoriteItem = {
      product_id,
      added_at: new Date().toISOString(),
    };

    if (!isAuthenticated) {
      const updated = [...favorites, newFavorite];
      setFavorites(updated);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));

      return;
    }

    try {
      await axios.post("/api/favorites", { product_id });
      setFavorites((prev) => [...prev, newFavorite]);
    } catch (err: any) {
      if (err.response?.status !== 409) {
        console.error("Error adding favorite:", err);

        throw err;
      }
    }
  };

  // Remove a favorite (handles guest & user)
  const removeFavorite = async (product_id: string) => {
    if (!isAuthenticated) {
      const updated = favorites.filter((f) => f.product_id !== product_id);
      setFavorites(updated);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));

      return;
    }

    try {
      await axios.delete("/api/favorites", { data: { product_id } });
      setFavorites((prev) => prev.filter((f) => f.product_id !== product_id));
    } catch (err) {
      console.error("Error removing favorite:", err);

      throw err;
    }
  };

  const isFavorite = (product_id: string) =>
    favorites.some((f) => f.product_id === product_id);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
