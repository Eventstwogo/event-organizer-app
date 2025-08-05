"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { Clock, CheckCircle, AlertCircle, Mail, Phone, MessageSquare, RefreshCw, User, Building } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosinstance";
import useStore from "@/lib/Zustand";

function OrganizationHoldContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userId, logout } = useStore();
  
  const referenceNumber = searchParams.get("ref") || "N/A";
  const organizationName = searchParams.get("org") || "Your Organization";
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Auto-refresh status every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;

    const statusTimer = setInterval(() => {
      checkVerificationStatus();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(statusTimer);
  }, [autoRefresh]);

  // Check verification status
  const checkVerificationStatus = async () => {
    if (!userId) return;

    setIsCheckingStatus(true);
    try {
      const response = await axiosInstance.get(`/organizers/status/${userId}`);
      const status = response.data.data?.verification_status;
      
      setLastChecked(new Date());
      
      if (status === 'approved') {
        toast.success("Great news! Your organization has been approved!");
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else if (status === 'rejected') {
        toast.error("Your application needs attention. Redirecting...");
        setTimeout(() => {
          router.push(`/rejected?ref=${referenceNumber}`);
        }, 2000);
      } else {
        toast.info("Status checked - still under review");
      }
    } catch (error) {
      console.error("Error checking status:", error);
      toast.error("Unable to check status at this time");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      {/* Image Side */}
      <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-amber-50 to-orange-50 h-full">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-80 h-80 mx-auto rounded-lg shadow-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <div className="text-center">
              <Clock className="w-24 h-24 text-amber-600 mx-auto mb-4 animate-pulse" />
              <div className="text-amber-700 font-semibold">Under Review</div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Verification in Progress
          </h2>
          <p className="text-gray-600 text-lg">
            We're reviewing your organization details to ensure everything meets our standards.
          </p>
        </div>
      </div>

      {/* Hold Status Side */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative h-full">
        {/* User Info & Logout */}
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>ID: {userId || 'N/A'}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Main Status Card */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4 shadow-lg mx-auto">
                <Clock className="w-10 h-10 text-white animate-pulse" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Account Under Review
              </CardTitle>
              <p className="text-lg text-gray-600 mt-2">
                Welcome, {organizationName}!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-700 mb-4">
                  Your organization account is currently being reviewed by our team. 
                  This process typically takes 1-3 business days.
                </p>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-3">
                  <p className="text-sm text-amber-700 font-medium">Your Reference Number:</p>
                  <p className="text-2xl font-extrabold text-amber-800 tracking-wide">
                    {referenceNumber}
                  </p>
                  <p className="text-xs text-amber-600">
                    Keep this number for your records
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">Review Process</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Application submitted</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-amber-500 rounded-full animate-pulse bg-amber-100"></div>
                    <span className="text-sm text-gray-700">Document verification in progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-400">Final approval pending</span>
                  </div>
                </div>
              </div>

              {/* Status Check Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={checkVerificationStatus}
                    disabled={isCheckingStatus}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isCheckingStatus ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Check Status
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span>Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
                  </div>
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Toggle
                  </button>
                </div>
                
                {lastChecked && (
                  <div className="text-center text-xs text-gray-500">
                    Last checked: {lastChecked.toLocaleTimeString()}
                  </div>
                )}
              </div>

              {/* Current Time */}
              <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p>Current time: {formatTime(currentTime)}</p>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next Card */}
   

       

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              variant="outline"
              className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50"
              asChild
            >
              <Link href="/">
                Return to Homepage
              </Link>
            </Button>
            
            <Button
              className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
              asChild
            >
              <Link href="/">
                Check Status Later
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrganizationHoldPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrganizationHoldContent />
    </Suspense>
  );
}