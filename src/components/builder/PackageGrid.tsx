"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { packages as allPackages } from "@/lib/data";
import { PackageCard } from "@/components/package-card";

interface PackageGridProps {
  title?: string;
  maxPackages?: number;
  showFilters?: boolean;
  children?: ReactNode;
}

export const PackageGrid = (props: PackageGridProps) => {
  const {
    title = "Popular Packages",
    maxPackages = 8,
    showFilters = false,
  } = props;

  const displayPackages = allPackages.slice(0, maxPackages);

  return (
    <section className="px-6 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold font-headline">{title}</h3>
        <Link
          href="/packages"
          className="text-sm font-medium text-primary hover:underline"
        >
          See all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayPackages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      {props.children}
    </section>
  );
};
