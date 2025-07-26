"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/auth/admin-auth-context";

export default function SuperAdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  useEffect(() => {
    // If authenticated, redirect to dashboard
    if (!isLoading && isAuthenticated) {
      router.replace("/superadmin/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // The layout will handle showing the login portal when not authenticated
  // This page component is just for routing logic
  return null;
}
