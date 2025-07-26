"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { LoginEnforcementModal } from "@/components/auth/login-enforcement-modal";
import { packages as allPackages } from "@/lib/data";

interface AuthCheckProps {
  children: React.ReactNode;
  packageId: string;
}

export function AuthCheck({ children, packageId }: AuthCheckProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const pkg = allPackages.find(p => p.id === Number(packageId));

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      setShowLoginModal(true);
    }
    setIsChecking(false);
  }, [user]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleModalClose = (open: boolean) => {
    setShowLoginModal(open);
    if (!open && !user) {
      // Redirect back to package details if they cancel login
      if (pkg) {
        router.push(`/packages/${pkg.slug}`);
      } else {
        router.push('/');
      }
    }
  };

  // Show loading while checking auth status
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the booking page
  if (user) {
    return <>{children}</>;
  }

  // If not authenticated, show login modal
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
        <p className="text-gray-600 mb-6">
          You need to be logged in to access the booking page. Please sign in to continue.
        </p>
      </div>

      <LoginEnforcementModal
        open={showLoginModal}
        onOpenChange={handleModalClose}
        onLoginSuccess={handleLoginSuccess}
        title="Please login to book your package"
        description={pkg ? `Sign in to book "${pkg.title}" and enjoy secure payments, direct agent communication, and more.` : "Please sign in to continue with your booking."}
      />
    </div>
  );
}
