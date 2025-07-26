"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/package-card";
import { useWishlist } from "@/components/context/wishlist-context";
import { useAuth } from "@/components/auth/auth-context";
import { LoginDialog } from "@/components/auth/login-dialog";

const ShortlistHeader = () => (
  <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm app-header agent-header-mobile">
    <div className="mx-auto flex max-w-2xl items-center justify-between p-2 xs:p-4 app-header-content">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon" className="touch-target">
          <ArrowLeft className="h-4 w-4 xs:h-5 xs:w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <h1 className="text-lg xs:text-xl font-bold text-foreground font-headline text-responsive-lg">
        Wishlist
      </h1>
      <div className="w-8 xs:w-10"></div>
    </div>
  </header>
);

export default function ShortlistPage() {
  const { user } = useAuth();
  const { getWishlistPackages, clearWishlist, wishlistItems } = useWishlist();
  const wishlistPackages = getWishlistPackages();

  if (!user) {
    return (
      <div className="bg-background text-foreground">
        <div className="mx-auto max-w-2xl">
          <div className="flex min-h-screen w-full flex-col">
            <ShortlistHeader />
            <main className="flex-1 overflow-y-auto p-3 xs:p-6 agent-container">
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Heart className="h-12 w-12 xs:h-16 xs:w-16 text-muted-foreground mb-3 xs:mb-4" />
                <h2 className="text-lg xs:text-2xl font-bold mb-2 text-responsive-lg">
                  Sign in to view your wishlist
                </h2>
                <p className="text-muted-foreground mb-4 xs:mb-6 max-w-md text-responsive-sm">
                  Save your favorite travel packages and access them anytime by
                  signing in to your account.
                </p>
                <LoginDialog />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistPackages.length === 0) {
    return (
      <div className="bg-background text-foreground">
        <div className="mx-auto max-w-2xl">
          <div className="flex min-h-screen w-full flex-col">
            <ShortlistHeader />
            <main className="flex-1 overflow-y-auto p-3 xs:p-6 agent-container">
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Heart className="h-12 w-12 xs:h-16 xs:w-16 text-muted-foreground mb-3 xs:mb-4" />
                <h2 className="text-lg xs:text-2xl font-bold mb-2 text-responsive-lg">
                  Your wishlist is empty
                </h2>
                <p className="text-muted-foreground mb-4 xs:mb-6 max-w-md text-responsive-sm">
                  Start exploring our amazing travel packages and save the ones
                  you love for later.
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
          <ShortlistHeader />
          <main className="flex-1 overflow-y-auto p-3 xs:p-6 agent-container">
            <div className="flex items-center justify-between mb-3 xs:mb-6 agent-spacing">
              <h2 className="text-base xs:text-lg font-bold font-headline text-responsive-base">
                {wishlistPackages.length} Package
                {wishlistPackages.length !== 1 ? "s" : ""} Saved
              </h2>
              {wishlistPackages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearWishlist}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 touch-target agent-btn-compact text-responsive-xs"
                >
                  <Trash2 className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                  <span className="hidden xs:inline">Clear All</span>
                  <span className="xs:hidden">Clear</span>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {wishlistPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>

            <div className="mt-8 p-6 bg-muted rounded-lg text-center">
              <h3 className="text-lg font-bold mb-2">Ready to book?</h3>
              <p className="text-muted-foreground mb-4">
                Compare your wishlisted packages and start planning your
                adventure.
              </p>
              <Link href="/packages">
                <Button variant="outline">Explore More Packages</Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
