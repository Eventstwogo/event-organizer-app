"use client";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { useSearchParams } from "next/navigation";

export default function VerificationRejected() {
  const searchParams = useSearchParams();
  const referenceNumber = searchParams.get("ref") || "N/A";

  
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      {/* Image Side */}
      <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-red-50 to-rose-50 h-full">
        <div className="text-center space-y-6 max-w-md">
          <Image
            src="/images/rejected.jpg"
            alt="Verification rejected illustration"
            width={400}
            height={400}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h2 className="text-3xl font-bold text-gray-800">
            Verification Issue
          </h2>
          <p className="text-gray-600 text-lg">
            There was an issue with your verification. Please review and
            resubmit your details.
          </p>
        </div>
      </div>
      {/* Rejection Side */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative h-full">
        <div className="w-full max-w-md bg-white/80 p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mb-4 shadow-lg mx-auto">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Verification Rejected
            </h1>
            <p className="text-lg text-gray-600">
              Your application could not be verified. Please check your details
              and try again.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-3">
              <p className="text-sm text-gray-500">Your Reference Number:</p>
              <p className="text-3xl font-extrabold text-gray-800 tracking-wide">
                {referenceNumber}
              </p>
            </div>
          </div>

          <div className="text-left space-y-3">
            <h3 className="text-xl font-semibold text-gray-800">Next Steps</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                Review your submitted ABN and business details for accuracy.
              </li>
              <li>
                Contact support if you need assistance with your application.
              </li>
              <li>Resubmit your onboarding wednesday for verification.</li>
            </ul>
          </div>

          <div className="flex justify-center pt-2">
            <div className="pt-2 flex justify-center">
              <Link href="/signup" className="group">
                <div
                  className="h-12 px-6 bg-gradient-to-r from-red-600 to-rose-600 
        group-hover:from-red-700 group-hover:to-rose-700 
        text-white font-semibold rounded-lg shadow-lg 
        group-hover:shadow-xl transition-all duration-200 
        transform group-hover:scale-[1.02] flex items-center 
        justify-center"
                >
                  Contact Support
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
