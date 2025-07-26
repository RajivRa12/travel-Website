"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Wand2, Layout, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BuilderDemoHeader = () => (
  <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
    <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <h1 className="text-xl font-bold text-foreground font-headline">
        Builder.io Visual Editor Demo
      </h1>
      <div className="w-10"></div>
    </div>
  </header>
);

export default function BuilderDemoPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-4xl">
        <div className="flex min-h-screen w-full flex-col">
          <BuilderDemoHeader />
          <main className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Introduction */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto">
                <Wand2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">
                Builder.io Integration Ready
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your Roam Southeast platform is now equipped with Builder.io for
                visual content management. Create and edit pages, sections, and
                components without touching code.
              </p>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Integration Complete
              </Badge>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-blue-500" />
                    Custom Components
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pre-built travel components ready for visual editing:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Hero Section with search
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Testimonials Carousel
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Package Grid Display
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-500" />
                    Visual Editing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag & drop interface with real-time preview:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Live content editing
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Custom styling options
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Responsive design tools
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-green-500" />
                    Content Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Powerful content management features:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Page templates
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Content scheduling
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      A/B testing support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Setup Instructions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">
                    1. Get Your Builder.io API Key
                  </h4>
                  <p className="text-sm text-blue-700">
                    Sign up at{" "}
                    <a
                      href="https://builder.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      builder.io
                    </a>{" "}
                    and get your API key from the settings.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">
                    2. Configure Environment
                  </h4>
                  <div className="bg-blue-100 p-3 rounded text-sm font-mono">
                    NEXT_PUBLIC_BUILDER_API_KEY=your-api-key-here
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">
                    3. Create Content
                  </h4>
                  <p className="text-sm text-blue-700">
                    Use the Builder.io visual editor to create pages and
                    sections with your custom travel components.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Component Preview */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center">
                Component Previews
              </h3>

              {/* Show the actual components */}
              <div className="space-y-8 border rounded-lg p-6 bg-gray-50">
                <div className="text-center">
                  <Badge variant="outline">Hero Section Component</Badge>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg text-center">
                  <h2 className="text-3xl font-bold mb-4">
                    Your Southeast Asian Adventure Awaits
                  </h2>
                  <p className="mb-6 text-blue-100">
                    Buy pre-packaged tours directly from local experts. No
                    markups.
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="bg-white/20 p-3 rounded-full">
                      <span className="text-white/70">
                        Search for destinations or packages
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 border rounded-lg p-6 bg-gray-50">
                <div className="text-center">
                  <Badge variant="outline">Package Grid Component</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow">
                      <div className="bg-gray-200 h-32 rounded mb-3"></div>
                      <h4 className="font-semibold">Sample Package {i}</h4>
                      <p className="text-sm text-gray-600">
                        Destination • 5 Days
                      </p>
                      <p className="font-bold text-primary mt-2"><span className="rupee-font">₹</span>35,000</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-4 py-8">
              <h3 className="text-2xl font-bold">Ready to Start Building?</h3>
              <p className="text-muted-foreground">
                Your travel platform is fully integrated with Builder.io's
                visual editing capabilities.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <a
                    href="https://builder.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Builder.io
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Back to Platform</Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
