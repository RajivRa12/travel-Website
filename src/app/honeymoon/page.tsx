"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packages as allPackages } from "@/lib/data";
import { PackageCard } from "@/components/package-card";

const HoneymoonHeader = () => (
  <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
    <div className="mx-auto flex max-w-2xl items-center justify-between p-4">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <h1 className="text-xl font-bold text-foreground font-headline">
        Honeymoon Escapes
      </h1>
      <div className="w-10"></div>
    </div>
  </header>
);

export default function HoneymoonPage() {
  // Filter for honeymoon specific packages if a tag exists, or just show some romantic ones.
  const honeymoonPackages = allPackages
    .filter(
      (p) => p.destination === "Indonesia" || p.destination === "Thailand",
    )
    .slice(0, 4);

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-2xl">
        <div className="flex min-h-screen w-full flex-col">
          <HoneymoonHeader />
          <main className="flex-1 overflow-y-auto pb-24">
            <div className="relative h-64 w-full">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Romantic beach sunset"
                layout="fill"
                objectFit="cover"
                data-ai-hint="couple beach sunset"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-center text-center text-white p-4">
                <h2 className="text-4xl font-bold font-headline">
                  Unforgettable Journeys for Two
                </h2>
                <p className="mt-2 max-w-md">
                  Craft the perfect start to your new life together with our
                  handpicked romantic getaways.
                </p>
              </div>
            </div>

            <section className="p-6">
              <h3 className="text-xl font-bold font-headline mb-4">
                Popular Romantic Packages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {honeymoonPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            </section>
            <section className="px-6 py-8 bg-muted">
              <h3 className="text-xl font-bold font-headline text-center mb-4">
                Why Choose Us for Your Honeymoon?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <Heart className="mx-auto h-10 w-10 text-primary mb-2" />
                  <h4 className="font-bold">Tailored for Romance</h4>
                  <p className="text-sm text-muted-foreground">
                    Packages designed with privacy, romance, and unique
                    experiences in mind.
                  </p>
                </div>
                <div>
                  <ShieldCheck className="mx-auto h-10 w-10 text-primary mb-2" />
                  <h4 className="font-bold">Trusted Operators</h4>
                  <p className="text-sm text-muted-foreground">
                    Book directly with verified local experts for a seamless and
                    authentic trip.
                  </p>
                </div>
                <div>
                  <Star className="mx-auto h-10 w-10 text-primary mb-2" />
                  <h4 className="font-bold">Exclusive Perks</h4>
                  <p className="text-sm text-muted-foreground">
                    Enjoy special inclusions like dinners, spa treatments, and
                    more.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
