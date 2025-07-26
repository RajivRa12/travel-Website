"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { packages as allPackages } from "@/lib/data";
import { useAuth } from "@/components/auth/auth-context";

type Package = (typeof allPackages)[0];

type WishlistContextType = {
  wishlistItems: number[];
  addToWishlist: (packageId: number) => boolean; // returns false if not authenticated
  removeFromWishlist: (packageId: number) => void;
  toggleWishlist: (packageId: number) => boolean; // returns false if not authenticated
  isInWishlist: (packageId: number) => boolean;
  getWishlistPackages: () => Package[];
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  // Load wishlist from localStorage when user logs in
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.email}`);
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch (error) {
          console.error("Error loading wishlist from localStorage:", error);
        }
      }
    } else {
      // Clear wishlist when user logs out
      setWishlistItems([]);
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user && wishlistItems.length >= 0) {
      localStorage.setItem(
        `wishlist_${user.email}`,
        JSON.stringify(wishlistItems),
      );
    }
  }, [wishlistItems, user]);

  const addToWishlist = (packageId: number): boolean => {
    if (!user) {
      return false; // User must be authenticated
    }

    if (!wishlistItems.includes(packageId)) {
      setWishlistItems((prev) => [...prev, packageId]);
    }
    return true;
  };

  const removeFromWishlist = (packageId: number) => {
    setWishlistItems((prev) => prev.filter((id) => id !== packageId));
  };

  const toggleWishlist = (packageId: number): boolean => {
    if (!user) {
      return false; // User must be authenticated
    }

    if (wishlistItems.includes(packageId)) {
      removeFromWishlist(packageId);
    } else {
      addToWishlist(packageId);
    }
    return true;
  };

  const isInWishlist = (packageId: number): boolean => {
    return wishlistItems.includes(packageId);
  };

  const getWishlistPackages = (): Package[] => {
    return allPackages.filter((pkg) => wishlistItems.includes(pkg.id));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        getWishlistPackages,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
