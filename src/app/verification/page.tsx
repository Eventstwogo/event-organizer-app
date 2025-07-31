

"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import useStore from "@/lib/Zustand";
import Step4VerificationConfirmation from "@/components/organizer/onboarding/confirmation";

export default function Verification() {
  const { user } = useStore();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleRetry = () => {
    router.push("/onboarding");
  };

  useEffect(() => {
    if (!user) {
      console.log("No user data, redirecting to login");
      router.push("/");
      return;
    }

    if (user.is_approved) {
      console.log("User is approved, redirecting to /dashboard");
      router.push("/dashboard");
      return;
    }

    if (!user.ref_number) {
      console.log("No ref_number, redirecting to /onboarding");
      router.push("/onboarding");
      return;
    }

    // If user is valid and has ref_number but not approved, allow rendering
    setShouldRender(true);
  }, [user, router]);

  // Avoid rendering until routing checks are completed
  if (!shouldRender) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <p className="text-lg text-gray-600">Checking verification status...</p>
      </div>
    );
  }

  return (
    <Step4VerificationConfirmation
      referenceNumber={user?.ref_number}
      onGoHome={handleGoHome}
    />
  );
}
