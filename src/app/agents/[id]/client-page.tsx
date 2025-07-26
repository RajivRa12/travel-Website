"use client";

import * as React from "react";
import { Star, Phone, Mail, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PackageCard } from "@/components/package-card";
import { packages as allPackages } from "@/lib/data";

// In a real app, you would fetch this data based on the ID
const agents = [
  {
    id: 1,
    name: "Siam Adventures",
    logo: "https://placehold.co/100x100.png",
    hint: "company logo",
    rating: 4.8,
    reviews: 120,
    specialty: "Thailand & Laos",
    phone: "+66 2 123 4567",
    email: "contact@siamadventures.com",
    website: "siamadventures.com",
    description:
      "Siam Adventures is a premier tour operator in Thailand, offering unforgettable experiences from the bustling streets of Bangkok to the serene temples of Chiang Mai. We pride ourselves on authentic local guides and personalized service.",
  },
  {
    id: 2,
    name: "Bali Horizons",
    logo: "https://placehold.co/100x100.png",
    hint: "travel company",
    rating: 4.9,
    reviews: 250,
    specialty: "Indonesia & Malaysia",
    phone: "+62 361 987 654",
    email: "info@balihorizons.com",
    website: "balihorizons.com",
    description:
      "Explore the magic of the Indonesian archipelago with Bali Horizons. From stunning beaches to ancient temples, our expert team curates journeys that capture the heart and soul of Southeast Asia.",
  },
  {
    id: 3,
    name: "Indochina Trails",
    logo: "https://placehold.co/100x100.png",
    hint: "logo travel",
    rating: 4.7,
    reviews: 180,
    specialty: "Vietnam & Philippines",
    phone: "+84 24 555 8888",
    email: "support@indochinatrails.com",
    website: "indochinatrails.com",
    description:
      "Discover the rich history and vibrant cultures of Vietnam and the Philippines with Indochina Trails. Our tours are designed to be immersive, educational, and breathtakingly beautiful.",
  },
  {
    id: 4,
    name: "Lanka Pearl Tours",
    logo: "https://placehold.co/100x100.png",
    hint: "tour company",
    rating: 4.9,
    reviews: 95,
    specialty: "Sri Lanka & Singapore",
    phone: "+94 11 222 3333",
    email: "bookings@lankapearl.com",
    website: "lankapearl.com",
    description:
      "Experience the teardrop island of Sri Lanka like never before. Lanka Pearl Tours offers bespoke itineraries covering ancient cities, lush tea plantations, and stunning coastlines.",
  },
];

export function AgentPageClientContent({
  agent,
  agentPackages,
}: {
  agent: (typeof agents)[0];
  agentPackages: any[];
}) {
  const [wishlist, setWishlist] = React.useState(
    new Set(allPackages.filter((p) => p.isWishlisted).map((p) => p.id)),
  );

  const handleWishlistToggle = (id: number) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(id)) {
        newWishlist.delete(id);
      } else {
        newWishlist.add(id);
      }
      return newWishlist;
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <Card className="overflow-hidden border-none shadow-lg mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarImage src={agent.logo} data-ai-hint={agent.hint} />
              <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold font-headline">{agent.name}</h2>
              <p className="text-muted-foreground">{agent.specialty}</p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-5 w-5 text-accent fill-current" />
                <span className="font-bold">{agent.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({agent.reviews} reviews)
                </span>
              </div>
              <p className="mt-4 text-sm">{agent.description}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${agent.phone}`} className="hover:underline">
                {agent.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${agent.email}`} className="hover:underline">
                {agent.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href={`https://${agent.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {agent.website}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-bold font-headline mb-4">
        Packages by {agent.name}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentPackages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </main>
  );
}
