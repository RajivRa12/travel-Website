import * as React from "react";
import { packages as allPackages, agents } from "@/lib/data";
import { PackageDetailsClient } from "./client";

export default async function PackageDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Support both slug and ID routing for better UX
  const pkg = allPackages.find(
    (p) => p.slug === slug || p.id.toString() === slug,
  );
  const agent = pkg ? agents.find((a) => a.id === pkg.agentId) : undefined;

  if (!pkg || !agent) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Package not found.
      </div>
    );
  }

  return <PackageDetailsClient pkg={pkg} agent={agent} />;
}
