"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  showSearch?: boolean;
  children?: ReactNode;
}

export const HeroSection = (props: HeroSectionProps) => {
  const {
    title = "Your Southeast Asian Adventure Awaits",
    subtitle = "Buy pre-packaged tours directly from local experts. No markups.",
    backgroundImage,
    showSearch = true,
  } = props;

  const sectionStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }
    : {};

  return (
    <section
      className="p-6 text-center min-h-[400px] flex flex-col justify-center"
      style={sectionStyle}
    >
      <h2 className="text-3xl font-bold font-headline tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-2 mb-6 ${backgroundImage ? "text-gray-200" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}

      {showSearch && (
        <div className="relative max-w-md mx-auto">
          <Input
            placeholder="Search for destinations or packages"
            className="pl-10 h-12 text-base rounded-full shadow-md"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      )}

      {props.children}
    </section>
  );
};
