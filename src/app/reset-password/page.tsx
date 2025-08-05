"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import ResetPasswordInfo from "@/components/organizer/auth/reset-password-info";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[a-z]/, "Must include at least one lowercase letter")
  .regex(/\d/, "Must include at least one number")
  .regex(/[!@#$%^&*]/, "Must include at least one special character");

const resetPasswordSchema = z.object({
  new_password: passwordSchema,
  confirm_password: z.string(),
});

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [submitting, setSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(
      resetPasswordSchema.refine(
        (data) => data.new_password === data.confirm_password,
        {
          message: "Passwords do not match",
          path: ["confirm_password"],
        }
      )
    ),
  });

  const password = watch("new_password");
  const confirmPassword = watch("confirm_password");
  // Password requirements
  const requirements = [
    { label: "At least 8 characters", met: password?.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One special character (!@#$%^&*)", met: /[!@#$%^&*]/.test(password) },
  ];
  const allMet = requirements.every(r => r.met);
  const passwordsMatch = password === confirmPassword && !!password;

  const onSubmit = useCallback(async (data: z.infer<typeof resetPasswordSchema>) => {
    if (submitting) return; // Prevent multiple simultaneous requests
    
    setSubmitting(true);
    try {
      await axiosInstance.post(
        "/admin/reset-password/token",
        new URLSearchParams({
          email,
          token,
          new_password: data.new_password,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      
      toast.success("Password reset successful. Please login.");
      router.push("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reset password.");
    } finally {
      setSubmitting(false);
    }
  }, [email, token, router, submitting]);

  const toggleNewPasswordVisibility = useCallback(() => {
    setShowNewPassword(prev => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <ResetPasswordInfo />

      <div className="flex items-center justify-center p-6 lg:p-8 relative">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-10 animate-pulse delay-500"></div>

        <div className="mx-auto w-full max-w-md space-y-8 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="text-lg text-gray-600">
              Create a strong, secure password for your organizer account.
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Create New Password
                </h2>
                <p className="text-gray-500 mt-1">
                  Your new password must meet all security requirements
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="new_password" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      {...register("new_password")}
                      className="h-12 px-4 pr-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      onClick={toggleNewPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Password requirements checklist */}
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                    <ul className="space-y-1">
                      {requirements.map((req, idx) => (
                        <li key={idx} className={`flex items-center text-xs ${req.met ? "text-green-600" : "text-gray-500"}`}>
                          <CheckCircle className={`h-3 w-3 mr-2 ${req.met ? "text-green-500" : "text-gray-300"}`} />
                          {req.label}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Password strength meter */}
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        allMet
                          ? 'bg-green-500 w-full'
                          : requirements.filter(r => r.met).length >= 3
                          ? 'bg-blue-400 w-4/5'
                          : requirements.filter(r => r.met).length === 2
                          ? 'bg-yellow-400 w-3/5'
                          : requirements.filter(r => r.met).length === 1
                          ? 'bg-red-400 w-1/5'
                          : ''
                      }`}
                    />
                  </div>

                  {errors.new_password && (
                    <p className="text-red-500 text-sm">{errors.new_password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      {...register("confirm_password")}
                      className="h-12 px-4 pr-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Password match feedback */}
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-red-500 text-sm">Passwords do not match</p>
                  )}
                  {confirmPassword && passwordsMatch && (
                    <p className="text-green-600 text-sm flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Passwords match
                    </p>
                  )}

                  {errors.confirm_password && (
                    <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={submitting || !allMet || !passwordsMatch}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </Button>
              </form>

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

export default function ResetPasswordWithTokenPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
} 