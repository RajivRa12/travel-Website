"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Bell, CheckCircle, Megaphone, Heart, Calendar, Star, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/auth-context";
import { LoginDialog } from "@/components/auth/login-dialog";
import { cn } from "@/lib/utils";

const NotificationsHeader = () => (
  <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm app-header agent-header-mobile">
    <div className="mx-auto flex max-w-2xl items-center justify-between p-2 xs:p-4 app-header-content">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon" className="touch-target">
          <ArrowLeft className="h-4 w-4 xs:h-5 xs:w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <h1 className="text-lg xs:text-xl font-bold text-foreground font-headline text-responsive-lg">
        Notifications
      </h1>
      <div className="w-8 xs:w-10"></div>
    </div>
  </header>
);

const mockNotifications = [
  {
    id: 1,
    type: "booking",
    title: "Booking Confirmed",
    message: "Your Bali Adventure package booking has been confirmed!",
    timestamp: "2 hours ago",
    read: false,
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: 2,
    type: "deal",
    title: "New Deals Available",
    message: "Special offers for Thailand packages - Up to 30% off!",
    timestamp: "1 day ago",
    read: false,
    icon: Megaphone,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 3,
    type: "review",
    title: "Review Request",
    message: "How was your trip to Singapore? Share your experience!",
    timestamp: "2 days ago",
    read: true,
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    id: 4,
    type: "wishlist",
    title: "Wishlist Update",
    message: "Price dropped for Bangkok Discovery package by ₹5,000!",
    timestamp: "3 days ago",
    read: true,
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: 5,
    type: "reminder",
    title: "Trip Reminder",
    message: "Your Mumbai to Thailand trip is coming up in 5 days!",
    timestamp: "1 week ago",
    read: true,
    icon: Calendar,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    id: 6,
    type: "info",
    title: "Travel Guidelines",
    message: "Updated COVID-19 travel guidelines for Southeast Asia.",
    timestamp: "1 week ago",
    read: true,
    icon: Info,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
];

const NotificationCard = ({ notification }: { notification: typeof mockNotifications[0] }) => {
  const Icon = notification.icon;
  
  return (
    <Card className={cn(
      "overflow-hidden border transition-all hover:shadow-md agent-card",
      !notification.read && "ring-2 ring-primary/20 bg-primary/5"
    )}>
      <CardContent className="p-3 xs:p-4 p-mobile-3">
        <div className="flex gap-3 xs:gap-4 agent-spacing">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 xs:w-12 xs:h-12 rounded-full shrink-0",
            notification.bgColor
          )}>
            <Icon className={cn("h-5 w-5 xs:h-6 xs:w-6", notification.color)} />
          </div>
          
          <div className="flex-1 space-y-1 xs:space-y-2 space-mobile-1">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm xs:text-base text-responsive-sm">
                {notification.title}
              </h3>
              {!notification.read && (
                <Badge variant="secondary" className="ml-2 px-2 py-1 text-xs">
                  New
                </Badge>
              )}
            </div>
            
            <p className="text-xs xs:text-sm text-muted-foreground text-responsive-xs">
              {notification.message}
            </p>
            
            <p className="text-xs text-muted-foreground text-responsive-xs">
              {notification.timestamp}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = React.useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!user) {
    return (
      <div className="bg-background text-foreground">
        <div className="mx-auto max-w-2xl">
          <div className="flex min-h-screen w-full flex-col">
            <NotificationsHeader />
            <main className="flex-1 overflow-y-auto p-3 xs:p-6 agent-container">
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Bell className="h-12 w-12 xs:h-16 xs:w-16 text-muted-foreground mb-3 xs:mb-4" />
                <h2 className="text-lg xs:text-2xl font-bold mb-2 text-responsive-lg">
                  Sign in to view notifications
                </h2>
                <p className="text-muted-foreground mb-4 xs:mb-6 max-w-md text-responsive-sm">
                  Stay updated with booking confirmations, special offers, and travel reminders.
                </p>
                <LoginDialog />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-background text-foreground">
        <div className="mx-auto max-w-2xl">
          <div className="flex min-h-screen w-full flex-col">
            <NotificationsHeader />
            <main className="flex-1 overflow-y-auto p-3 xs:p-6 agent-container">
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Bell className="h-12 w-12 xs:h-16 xs:w-16 text-muted-foreground mb-3 xs:mb-4" />
                <h2 className="text-lg xs:text-2xl font-bold mb-2 text-responsive-lg">
                  No notifications yet
                </h2>
                <p className="text-muted-foreground mb-4 xs:mb-6 max-w-md text-responsive-sm">
                  We'll notify you about booking updates, special offers, and travel reminders.
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
          <NotificationsHeader />
          <main className="flex-1 overflow-y-auto p-3 xs:p-6 agent-container">
            <div className="flex items-center justify-between mb-3 xs:mb-6 agent-spacing">
              <h2 className="text-base xs:text-lg font-bold font-headline text-responsive-base">
                {notifications.length} Notification{notifications.length !== 1 ? "s" : ""}
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount} new
                  </Badge>
                )}
              </h2>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="touch-target agent-btn-compact text-responsive-xs"
                >
                  <CheckCircle className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                  <span className="hidden xs:inline">Mark All Read</span>
                  <span className="xs:hidden">Read All</span>
                </Button>
              )}
            </div>

            <div className="space-y-2 xs:space-y-4 space-mobile-2">
              {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>

            <div className="mt-6 xs:mt-8 p-3 xs:p-6 bg-muted rounded-lg text-center agent-card">
              <h3 className="text-base xs:text-lg font-bold mb-2 text-responsive-base">Stay Updated</h3>
              <p className="text-muted-foreground mb-4 text-responsive-sm">
                Turn on notifications to get instant updates about your bookings and exclusive offers.
              </p>
              <Button variant="outline" className="touch-target">
                <Bell className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
