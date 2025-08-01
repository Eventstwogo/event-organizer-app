"use client";
import Image from "next/image";
import type React from "react";

import { Building, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axiosinstance";

interface Step3Props {
  abnDetails: {
    abn: string;
    verifiedBusinessName: string;
    verifiedAddress: string;
    verifiedStatus: string;
    verifiedType: string;
    verificationStatus: "idle" | "loading" | "success" | "error";
    verificationMessage: string;
  };
  setAbnDetails: React.Dispatch<
    React.SetStateAction<{
      abn: string;
      verifiedBusinessName: string;
      verifiedAddress: string;
      verifiedStatus: string;
      verifiedType: string;
      verificationStatus: "idle" | "loading" | "success" | "error";
      verificationMessage: string;
    }>
  >;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3AbnVerification({
  abnDetails,
  setAbnDetails,
  onNext,
  onBack,
}: Step3Props) {
  const handleVerification = async () => {
    if (!abnDetails.abn) {
      setAbnDetails((prev) => ({
        ...prev,
        verificationStatus: "error",
        verificationMessage: "Please enter an ABN.",
      }));
      return;
    }

    setAbnDetails((prev) => ({
      ...prev,
      verificationStatus: "loading",
      verificationMessage: "",
    }));

    try {
      const response = await axiosInstance.get(
        `/organizers/abn/{abn_id}?id=${abnDetails.abn}`
      );
      const data = response.data.data;

      if (data.entity_name && data.status && data.location && data.type) {
        setAbnDetails((prev) => ({
          ...prev,
          verifiedBusinessName: data.entity_name,
          verifiedAddress: data.location,
          verifiedStatus: data.status,
          verifiedType: data.type,
          verificationStatus: "success",
          verificationMessage: "ABN verified successfully!",
        }));
      } else {
        setAbnDetails((prev) => ({
          ...prev,
          verifiedBusinessName: "",
          verifiedAddress: "",
          verifiedStatus: "",
          verifiedType: "",
          verificationStatus: "error",
          verificationMessage: response.data.message || "Verification failed.",
        }));
      }
    } catch (error: any) {
      setAbnDetails((prev) => ({
        ...prev,
        verifiedBusinessName: "",
        verifiedAddress: "",
        verifiedStatus: "",
        verifiedType: "",
        verificationStatus: "error",
        verificationMessage:
          error.response?.data?.message ||
          "Server error during ABN verification.",
      }));
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      {/* Image Side */}
      <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50 h-full">
        <div className="text-center space-y-6 max-w-md">
          <Image
            src="/images/verify.png"
            alt="Event organizer verification illustration"
            width={400}
            height={400}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h2 className="text-3xl font-bold text-gray-800">
            Verify Your Organization
          </h2>
          <p className="text-gray-600 text-lg">
            Verify your business credentials to build trust with event attendees
            and ensure secure transactions.
          </p>
        </div>
      </div>
      {/* Form Side */}
      <div className="flex items-center justify-center p-6 lg:p-8 relative h-full">
        <div className="w-full max-w-md bg-white/80 space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl mb-4 shadow-lg mx-auto">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Verify Your Organization
            </h1>
            <p className="text-lg text-gray-600">
              Enter your ABN to verify your event organizing business.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="abn">Australian Business Number (ABN)</Label>
              <Input
                id="abn"
                placeholder="e.g., 12 345 678 901"
                value={abnDetails.abn}
                onChange={(e) =>
                  setAbnDetails({
                    ...abnDetails,
                    abn: e.target.value,
                    verificationStatus: "idle",
                    verificationMessage: "",
                    verifiedBusinessName: "",
                    verifiedAddress: "",
                    verifiedStatus: "",
                    verifiedType: "",
                  })
                }
                className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200"
                required
              />
              <Button
                onClick={handleVerification}
                disabled={
                  abnDetails.verificationStatus === "loading" ||
                  abnDetails.verificationStatus === "success"
                }
                className="w-full mt-4 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
              >
                {abnDetails.verificationStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : abnDetails.verificationStatus === "success" ? (
                  "Verified"
                ) : (
                  "Verify ABN"
                )}
              </Button>

              {abnDetails.verificationMessage && (
                <p
                  className={cn("text-sm mt-2 flex items-center gap-1", {
                    "text-green-600":
                      abnDetails.verificationStatus === "success",
                    "text-red-600": abnDetails.verificationStatus === "error",
                  })}
                >
                  {abnDetails.verificationStatus === "success" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {abnDetails.verificationMessage}
                </p>
              )}
            </div>

            {abnDetails.verificationStatus === "success" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Business Name
                    </Label>
                    <Input
                      value={abnDetails.verifiedBusinessName}
                      readOnly
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Status
                    </Label>
                    <Input
                      value={abnDetails.verifiedStatus}
                      readOnly
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Type
                    </Label>
                    <Input
                      value={abnDetails.verifiedType}
                      readOnly
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Location
                    </Label>
                    <Input
                      value={abnDetails.verifiedAddress}
                      readOnly
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={onNext}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={onBack}
              className="h-12 border-2 border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors duration-200 bg-transparent"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
