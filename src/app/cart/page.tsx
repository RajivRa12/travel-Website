"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/components/context/cart-context";
import { useAuth } from "@/components/auth/auth-context";
import { LoginDialog } from "@/components/auth/login-dialog";

const CartHeader = () => (
  <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm app-header agent-header-mobile">
    <div className="mx-auto flex max-w-2xl items-center justify-between p-2 xs:p-4 app-header-content">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon" className="touch-target">
          <ArrowLeft className="h-4 w-4 xs:h-5 xs:w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <h1 className="text-lg xs:text-xl font-bold text-foreground font-headline text-responsive-lg">
        Add Wishlist
      </h1>
      <div className="w-8 xs:w-10"></div>
    </div>
  </header>
);

export default function CartPage() {
  const { user } = useAuth();
  const {
    items,
    removeFromCart,
    updateQuantity,
    updateTravelers,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const handleCheckout = () => {
    // This would integrate with Stripe in a real implementation
    alert(
      "Checkout functionality would integrate with Stripe payment processing here.",
    );
  };

  if (!user) {
    return (
      <div className="bg-background text-foreground">
        <div className="mx-auto max-w-2xl">
          <div className="flex min-h-screen w-full flex-col">
            <CartHeader />
            <main className="flex-1 overflow-y-auto p-3 xs:p-6 agent-container">
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <ShoppingCart className="h-12 w-12 xs:h-16 xs:w-16 text-muted-foreground mb-3 xs:mb-4" />
                <h2 className="text-lg xs:text-2xl font-bold mb-2 text-responsive-lg">
                  Sign in to view your cart
                </h2>
                <p className="text-muted-foreground mb-4 xs:mb-6 max-w-md text-responsive-sm">
                  Add travel packages to your cart and complete your booking
                  with secure payment.
                </p>
                <LoginDialog />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-background text-foreground">
        <div className="mx-auto max-w-2xl">
          <div className="flex min-h-screen w-full flex-col">
            <CartHeader />
            <main className="flex-1 overflow-y-auto p-3 xs:p-6 agent-container">
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <ShoppingCart className="h-12 w-12 xs:h-16 xs:w-16 text-muted-foreground mb-3 xs:mb-4" />
                <h2 className="text-lg xs:text-2xl font-bold mb-2 text-responsive-lg">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-4 xs:mb-6 max-w-md text-responsive-sm">
                  Browse our amazing travel packages and add the ones you love to your wishlist.
                </p>
                <Link href="/packages">
                  <Button>Explore Packages</Button>
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-2xl">
        <div className="flex min-h-screen w-full flex-col">
          <CartHeader />
          <main className="flex-1 overflow-y-auto p-3 xs:p-6 pb-32 agent-container">
            <div className="flex items-center justify-between mb-3 xs:mb-6 agent-spacing">
              <h2 className="text-base xs:text-lg font-bold font-headline text-responsive-base">
                {getTotalItems()} Item{getTotalItems() !== 1 ? "s" : ""} in Wishlist
              </h2>
              {items.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 touch-target agent-btn-compact text-responsive-xs"
                >
                  <Trash2 className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                  <span className="hidden xs:inline">Clear Cart</span>
                  <span className="xs:hidden">Clear</span>
                </Button>
              )}
            </div>

            <div className="space-y-2 xs:space-y-4 space-mobile-2">
              {items.map((item) => (
                <Card key={item.package.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.package.image}
                          alt={item.package.title}
                          fill
                          className="object-cover"
                          data-ai-hint={item.package.hint}
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-sm">
                              {item.package.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {item.package.destination} •{" "}
                              {item.package.duration}
                            </p>
                            {item.selectedDate && (
                              <p className="text-xs text-muted-foreground">
                                Travel Date:{" "}
                                {new Date(
                                  item.selectedDate,
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.package.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-muted-foreground">
                              Travelers:
                            </label>
                            <div className="flex items-center border rounded">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  updateTravelers(
                                    item.package.id,
                                    Math.max(1, item.travelers - 1),
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-2 text-sm">
                                {item.travelers}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  updateTravelers(
                                    item.package.id,
                                    item.travelers + 1,
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-sm">
                              <span className="rupee-font">₹</span>
                              <span className="rupee-font">{(
                                parseInt(item.package.price.replace(/,/g, "")) *
                                item.travelers *
                                item.quantity
                              ).toLocaleString()}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <span className="rupee-font">₹</span>
                              <span className="rupee-font">{parseInt(
                                item.package.price.replace(/,/g, ""),
                              ).toLocaleString()}</span> {" "}
                              per person
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6 bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span className="rupee-font">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & Fees:</span>
                    <span className="rupee-font">₹{Math.round(getTotalPrice() * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="rupee-font">₹{(
                        getTotalPrice() + Math.round(getTotalPrice() * 0.18)
                      ).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>

          <footer className="fixed bottom-0 left-0 right-0 w-full bg-background/80 backdrop-blur-sm border-t">
            <div className="mx-auto max-w-2xl p-4">
              <Button
                size="lg"
                className="w-full text-lg"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Checkout - <span className="rupee-font">₹</span>{(
                  getTotalPrice() + Math.round(getTotalPrice() * 0.18)
                ).toLocaleString()}
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
