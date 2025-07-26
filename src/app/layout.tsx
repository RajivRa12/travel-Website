import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/auth-context";
import { CartProvider } from "@/components/context/cart-context";
import { WishlistProvider } from "@/components/context/wishlist-context";

export const metadata: Metadata = {
  title: "Roam Southeast",
  description:
    "A subscription marketplace that lets Indian travelers buy pre-packaged tours in South-East Asia directly from Destination Management Companies (DMCs).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
