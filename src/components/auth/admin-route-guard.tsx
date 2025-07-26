"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "./admin-auth-context";

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAdminAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // List of protected admin routes
        const protectedRoutes = [
            "/superadmin/dashboard",
            "/superadmin/agents",
            "/superadmin/subscriptions", 
            "/superadmin/packages",
            "/superadmin/bookings",
            "/superadmin/payouts",
            "/superadmin/content",
            "/superadmin/notifications",
            "/superadmin/customers",
            "/superadmin/settings",
            "/superadmin/database-status",
            "/superadmin/account-settings",
            "/superadmin/security"
        ];

        const isProtectedRoute = protectedRoutes.some(route => 
            pathname.startsWith(route)
        );

        // If trying to access a protected route while not authenticated, redirect to login
        if (!isLoading && !isAuthenticated && isProtectedRoute) {
            router.replace("/superadmin");
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Authenticating...</span>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
