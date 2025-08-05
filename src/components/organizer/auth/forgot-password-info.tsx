"use client";

import { Shield, Mail, Clock, RefreshCw } from "lucide-react";

export default function ForgotPasswordInfo() {
  return (
    <div className="flex items-center justify-center p-6 lg:p-8 bg-gradient-to-br from-purple-600 to-indigo-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-md space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Reset Your Password</h2>
          <p className="text-xl text-purple-100">
            Secure password recovery for your organizer account. We'll help you get back to managing your events.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Secure Process</h3>
              <p className="text-purple-100">
                Our password reset process uses secure tokens to ensure only you can reset your password.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Email Verification</h3>
              <p className="text-purple-100">
                Reset link will be sent to your registered email address for security verification.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Quick Recovery</h3>
              <p className="text-purple-100">
                Get back to managing your events quickly with our streamlined password recovery process.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <RefreshCw className="w-5 h-5" />
            <span className="font-semibold">
              Account Recovery Made Simple
            </span>
          </div>
          <p className="text-purple-100 text-sm">
            Don't worry! Password resets happen. We've made the process secure and straightforward to get you back to your events.
          </p>
        </div>
      </div>
    </div>
  );
}