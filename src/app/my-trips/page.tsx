"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  MapPin,
  Users,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  MessageSquare,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { useAuth } from "@/components/auth/auth-context";
import { useWishlist } from "@/components/context/wishlist-context";
import { useCart } from "@/components/context/cart-context";
import { LoginDialog } from "@/components/auth/login-dialog";
import {
  mockBookings,
  packages as allPackages,
  agents,
  BookingStatus,
} from "@/lib/data";

const MyTripsHeader = () => (
  <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm app-header agent-header-mobile">
    <div className="mx-auto flex max-w-2xl items-center justify-between p-2 xs:p-4 app-header-content">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon" className="touch-target">
          <ArrowLeft className="h-4 w-4 xs:h-5 xs:w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <h1 className="text-lg xs:text-xl font-bold text-foreground font-headline text-responsive-lg">
        My Dashboard
      </h1>
      <div className="w-8 xs:w-10"></div>
    </div>
  </header>
);

const getStatusIcon = (status: BookingStatus) => {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "cancelled":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const BookingCard = ({ booking }: { booking: (typeof mockBookings)[0] }) => {
  const packageData = allPackages.find((pkg) => pkg.id === booking.packageId);
  const agent = agents.find((a) => a.id === packageData?.agentId);

  if (!packageData) return null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
            <Image
              src={packageData.image}
              alt={packageData.title}
              fill
              className="object-cover"
              data-ai-hint={packageData.hint}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm">{packageData.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{packageData.destination}</span>
                  <span>•</span>
                  <Calendar className="h-3 w-3" />
                  <span>{packageData.duration}</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={getStatusColor(booking.status)}
              >
                <span className="flex items-center gap-1">
                  {getStatusIcon(booking.status)}
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </span>
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>
                  {booking.travelers} traveler
                  {booking.travelers !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  <span className="rupee-font">₹{booking.totalAmount.toLocaleString()}</span>
                </p>
                <p className="text-muted-foreground">
                  Booking #{booking.confirmation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => alert('E-Ticket download coming soon!')}
              >
                <Download className="h-3 w-3 mr-1" />
                E-Ticket
              </Button>
              {agent && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  asChild
                >
                  <a href={`mailto:${agent.email}`}>
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Contact {agent.name}
                  </a>
                </Button>
              )}
              {booking.status === "completed" && !booking.review && (
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Review
                </Button>
              )}
            </div>

            {booking.review && (
              <div className="bg-muted p-2 rounded text-xs">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="font-medium">{booking.review.rating}/5</span>
                </div>
                <p className="text-muted-foreground">
                  {booking.review.comment}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const { wishlistItems } = useWishlist();
  const { getTotalItems } = useCart();
  const upcomingTrips = mockBookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  ).length;
  const completedTrips = mockBookings.filter(
    (b) => b.status === "completed",
  ).length;

  return (
    <div className="grid grid-cols-2 gap-2 xs:gap-4 mb-3 xs:mb-6 agent-form-mobile">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full mx-auto mb-2">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">{upcomingTrips}</p>
          <p className="text-xs text-muted-foreground">Upcoming Trips</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{completedTrips}</p>
          <p className="text-xs text-muted-foreground">Completed Trips</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mx-auto mb-2">
            <Heart className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold">{wishlistItems.length}</p>
          <p className="text-xs text-muted-foreground">Saved Packages</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
            <Heart className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold">{getTotalItems()}</p>
          <p className="text-xs text-muted-foreground">Items in Wishlist</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function MyTripsPage() {
  const { user } = useAuth();
  const { addToWishlist, isInWishlist } = useWishlist();

  if (!user) {
    return (
      <div className="bg-background text-foreground">
        <div className="mx-auto max-w-2xl">
          <div className="flex min-h-screen w-full flex-col">
            <MyTripsHeader />
            <main className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Briefcase className="h-12 w-12 xs:h-16 xs:w-16 text-muted-foreground mb-3 xs:mb-4" />
                <h2 className="text-lg xs:text-2xl font-bold mb-2 text-responsive-lg">
                  Sign in to view your dashboard
                </h2>
                <p className="text-muted-foreground mb-4 xs:mb-6 max-w-md text-responsive-sm">
                  Access your bookings, trip history, and manage your travel
                  preferences.
                </p>
                <LoginDialog />
              </div>
            </main>
            <BottomNavBar />
          </div>
        </div>
      </div>
    );
  }

  const userBookings = mockBookings.filter(
    (booking) => booking.userId === user.email,
  );
  const upcomingBookings = userBookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  );
  const pastBookings = userBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled",
  );

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-2xl">
        <div className="flex min-h-screen w-full flex-col">
          <MyTripsHeader />
          <main className="flex-1 overflow-y-auto p-6 pb-24">
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">
                Welcome back, {user.name}!
              </h2>
              <p className="text-muted-foreground text-sm">
                Here's your travel dashboard overview
              </p>
            </div>

            <DashboardStats />

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past Trips ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4 mt-4">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No upcoming trips
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Time to plan your next adventure!
                    </p>
                    <Link href="/packages">
                      <Button>Explore Packages</Button>
                    </Link>
                  </div>
                ) : (
                  upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4 mt-4">
                {pastBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No past trips yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Your completed adventures will appear here.
                    </p>
                    <Link href="/packages">
                      <Button>Book Your First Trip</Button>
                    </Link>
                  </div>
                ) : (
                  pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-bold">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/packages">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Explore Packages
                  </Button>
                </Link>
              </div>
            </div>
          </main>
          <BottomNavBar />
        </div>
      </div>
    </div>
  );
}
