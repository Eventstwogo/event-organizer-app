"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useStore from "@/lib/Zustand";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, user, checkAuth } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/emailconfirmation",
    "/emailresend",
  ];

  // Routes that require specific approval status
  const statusSpecificRoutes = {
    verification: ["/verification"],
    hold: ["/hold"],
    rejected: ["/rejected"],
    approved: ["/dashboard", "/Events", "/profile", "/queries", "/onboarding"]
  };

  useEffect(() => {
    // Check authentication status
    checkAuth();
    setIsLoading(false);
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated and not on a public route, redirect to login
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push("/");
      return;
    }

    // If authenticated, check if user should be redirected based on approval status
    if (isAuthenticated && user) {
      const approvalStatus = user.is_approved;
      
      // Define where each approval status should be allowed
      const allowedRoutes = {
        0: ["/verification", ...publicRoutes], // Not verified
        1: ["/hold", ...publicRoutes], // Under review
        2: [...statusSpecificRoutes.approved, ...publicRoutes], // Approved
        [-1]: ["/rejected", ...publicRoutes], // Rejected
      };

      const userAllowedRoutes = allowedRoutes[approvalStatus as keyof typeof allowedRoutes] || publicRoutes;
      
      // Check if current path is allowed for user's status
      const isCurrentPathAllowed = userAllowedRoutes.some(route => {
        if (route === pathname) return true;
        // Handle dynamic routes
        if (pathname.startsWith("/Events/view/") && route === "/Events") return true;
        if (pathname.startsWith("/queries/") && route === "/queries") return true;
        return false;
      });

      if (!isCurrentPathAllowed) {
        // Redirect based on approval status
        switch (approvalStatus) {
          case 0:
            router.push("/verification");
            break;
          case 1:
            router.push(`/hold?ref=${encodeURIComponent(user.ref_number || "N/A")}`);
            break;
          case 2:
            router.push("/dashboard");
            break;
          case -1:
            router.push(`/rejected?ref=${encodeURIComponent(user.ref_number || "N/A")}`);
            break;
          default:
            router.push("/onboarding");
        }
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on a public route, don't render children
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return null; // Router will handle redirect
  }

  // Render children if authenticated or on public route
  return <>{children}</>;
};

export default AuthGuard;