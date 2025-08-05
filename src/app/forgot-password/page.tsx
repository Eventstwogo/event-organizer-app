"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ForgotPasswordInfo from "@/components/organizer/auth/forgot-password-info";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    if (isSubmitting) return; // Prevent multiple simultaneous requests
    
    try {
      await axiosInstance.post("/admin/forgot-password", new URLSearchParams({ email: data.email }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      setSubmitted(true);
      toast.success("Password reset link sent to registered email address.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send reset link.");
    }
  }, [isSubmitting]);

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <ForgotPasswordInfo />

      <div className="flex items-center justify-center p-6 lg:p-8 relative">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-10 animate-pulse delay-500"></div>

        <div className="mx-auto w-full max-w-md space-y-8 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {submitted ? "Check Your Email!" : "Forgot Password?"}
            </h1>
            <p className="text-lg text-gray-600">
              {submitted
                ? "We've sent a password reset link to your email address."
                : "No worries! Enter your email and we'll send you a reset link."}
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {submitted ? "Reset Link Sent" : "Reset Your Password"}
                </h2>
                <p className="text-gray-500 mt-1">
                  {submitted
                    ? "Check your inbox and follow the instructions to reset your password."
                    : "Enter your email address to receive a password reset link"}
                </p>
              </div>

              {submitted ? (
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg flex items-center space-x-3">
                  <Mail className="w-6 h-6 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Password reset link has been sent to your email address.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      {...register("email")}
                      className="h-12 px-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </form>
              )}

              <div className="text-center space-y-4">
                <Link href="/">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 