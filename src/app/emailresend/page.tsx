"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosinstance";
import ResendConfirmationInfo from "@/components/organizer/auth/resend-confirmation-info";

export default function ResendConfirmation() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/organizers/email/resend-token", {
        email,
      });

      if (response.status === 200) {
        setEmailSent(true);
        toast.success(
          response.data.message ||
            "Verification email has been resent successfully!"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send verification email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <ResendConfirmationInfo />

      {/* Resend Confirmation Side */}
      <div className="flex items-center justify-center p-6 lg:p-8 relative">
        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-purple-400 to-emerald-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse delay-500"></div>

        <div className="mx-auto w-full max-w-md space-y-8 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Need Another Email?
            </h1>
            <p className="text-lg text-gray-600">
              No worries! We'll send you a fresh confirmation link right away.
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Confirm your email address
                </h2>
                <p className="text-gray-500 mt-1">
                  We'll help you get that confirmation email
                </p>
              </div>

              {!emailSent ? (
                <>
                  <div className="text-center space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-gray-600 leading-relaxed">
                      Please enter your email and we'll send another
                      confirmation link.
                    </p>
                  </div>

                  <Button
                    onClick={handleResendEmail}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {loading ? "Sending..." : "Resend Confirmation Email"}
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-lg">
                    <p className="text-sm font-medium">
                      Verification email sent successfully! Please check your
                      inbox.
                    </p>
                  </div>
                  <p className="text-gray-600">
                    If you still don't see the email, please check your spam
                    folder.
                  </p>
                </div>
              )}

              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Remember your login details?{" "}
                  <Link
                    href="/"
                    className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors"
                  >
                    Sign In Here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
