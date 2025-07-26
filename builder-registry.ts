import { type RegisteredComponent } from "@builder.io/sdk-react";
import dynamic from "next/dynamic";

// Dynamic imports for custom components
const HeroSection = dynamic(() =>
  import("./src/components/builder/HeroSection").then((mod) => ({
    default: mod.HeroSection,
  })),
);

const TestimonialsSection = dynamic(() =>
  import("./src/components/builder/TestimonialsSection").then((mod) => ({
    default: mod.TestimonialsSection,
  })),
);

const PackageGrid = dynamic(() =>
  import("./src/components/builder/PackageGrid").then((mod) => ({
    default: mod.PackageGrid,
  })),
);

export const customComponents: RegisteredComponent[] = [
  {
    component: HeroSection,
    name: "HeroSection",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Your Southeast Asian Adventure Awaits",
        required: true,
      },
      {
        name: "subtitle",
        type: "string",
        defaultValue:
          "Buy pre-packaged tours directly from local experts. No markups.",
      },
      {
        name: "backgroundImage",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "webp"],
      },
      {
        name: "showSearch",
        type: "boolean",
        defaultValue: true,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: TestimonialsSection,
    name: "TestimonialsSection",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "What Our Travelers Say",
      },
      {
        name: "backgroundColor",
        type: "color",
        defaultValue: "#f8f9fa",
      },
    ],
    canHaveChildren: false,
  },
  {
    component: PackageGrid,
    name: "PackageGrid",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Popular Packages",
      },
      {
        name: "maxPackages",
        type: "number",
        defaultValue: 8,
      },
      {
        name: "showFilters",
        type: "boolean",
        defaultValue: false,
      },
    ],
    canHaveChildren: false,
  },
];
