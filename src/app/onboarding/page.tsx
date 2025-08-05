"use client";
import { useState } from "react";
import Step1StoreSetup from "../../components/organizer/onboarding/storesetup";
import Step2Goals from "../../components/organizer/onboarding/goals";
import Step3AbnVerification from "../../components/organizer/onboarding/verification";
import Step4VerificationConfirmation from "../../components/organizer/onboarding/confirmation";
import axiosInstance from "../../lib/axiosinstance";
import useStore from "../../lib/Zustand";
import { toast } from "sonner";

export default function VendorOnboarding() {
  const { userId } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [storeDetails, setStoreDetails] = useState({
    storeName: "",
    storeUrl: "",
    industry_id: "", // Ensure this matches backend type (string or number)
    location: "",
  });
  const [generalQuestions, setGeneralQuestions] = useState({
    mainGoals: [] as string[],
  });
  type VerificationStatus = "idle" | "loading" | "success" | "error";
  type AbnDetails = {
    abn: string;
    verifiedBusinessName: string;
    verifiedAddress: string;
    verifiedStatus: string;
    verifiedType: string;
    verificationStatus: VerificationStatus;
    verificationMessage: string;
  };
  const [abnDetails, setAbnDetails] = useState<AbnDetails>({
    abn: "",
    verifiedBusinessName: "",
    verifiedAddress: "",
    verificationStatus: "idle",
    verifiedStatus: "",
    verifiedType: "",
    verificationMessage: "",
  });
  const [referenceNumber, setReferenceNumber] = useState("");

  // Function to submit onboarding data to the backend
  const submitOnboarding = async () => {
    try {
      const trimmedAbn = abnDetails.abn.trim().replace(/\s+/g, '');
      
      const payload = {
        user_id: userId,
        purpose: generalQuestions.mainGoals,
        abn_id: trimmedAbn,
        store_name: storeDetails.storeName,
        store_url: `https://events2go.com/${storeDetails.storeUrl}`,
        industry_id: storeDetails.industry_id,
        location: storeDetails.location,
      };

      const response = await axiosInstance.post(
        `/organizers/onboarding?abn_id=${trimmedAbn}`,
        payload
      );
      const refNumber =
        response.data.reference_number ||
        `ONB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setReferenceNumber(refNumber); // Update referenceNumber state
      return {
        success: true,
        data: {
          ...response.data,
          reference_number: refNumber,
        },
      };
    } catch (error: any) {
      console.error("Onboarding error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred during onboarding.",
      };
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1StoreSetup
            storeDetails={storeDetails}
            setStoreDetails={setStoreDetails}
            onNext={() => {
              // Add validation if needed
              setCurrentStep(2);
            }}
          />
        );
      case 2:
        return (
          <Step2Goals
            generalQuestions={generalQuestions}
            setGeneralQuestions={setGeneralQuestions}
            onNext={() => {
              // Add validation if needed
              setCurrentStep(3);
            }}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <Step3AbnVerification
            abnDetails={abnDetails}
            setAbnDetails={setAbnDetails}
            onNext={async () => {
              const result = await submitOnboarding();
              if (result.success) {
                setCurrentStep(4); // Move to confirmation step after successful submission
              } else {
                toast.error(result.message); // Show error to user
              }
            }}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return (
          <Step4VerificationConfirmation
            referenceNumber={referenceNumber}
            onGoHome={() => {
              // Replace with actual navigation (e.g., using next/router)
              window.location.href = "/dashboard"; // Example redirection
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 ">
      <div className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-5 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-12 h-12 bg-purple-200 rounded-full opacity-5 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-emerald-200 rounded-full opacity-5 animate-pulse delay-500"></div>
      <div className="relative z-10 w-full h-full">{renderStep()}</div>
    </div>
  );
}
