"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { packages as allPackages } from "@/lib/data";

type Package = (typeof allPackages)[0];

type CartItem = {
  package: Package;
  quantity: number;
  travelers: number;
  selectedDate?: string;
  addedAt: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (
    packageItem: Package,
    travelers: number,
    selectedDate?: string,
  ) => void;
  removeFromCart: (packageId: number) => void;
  updateQuantity: (packageId: number, quantity: number) => void;
  updateTravelers: (packageId: number, travelers: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (
    packageItem: Package,
    travelers: number,
    selectedDate?: string,
  ) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.package.id === packageItem.id,
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.package.id === packageItem.id
            ? { ...item, quantity: item.quantity + 1, travelers }
            : item,
        );
      }

      return [
        ...prevItems,
        {
          package: packageItem,
          quantity: 1,
          travelers,
          selectedDate,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const removeFromCart = (packageId: number) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.package.id !== packageId),
    );
  };

  const updateQuantity = (packageId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(packageId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.package.id === packageId ? { ...item, quantity } : item,
      ),
    );
  };

  const updateTravelers = (packageId: number, travelers: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.package.id === packageId ? { ...item, travelers } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseInt(item.package.price.replace(/,/g, ""));
      return total + price * item.travelers * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateTravelers,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
