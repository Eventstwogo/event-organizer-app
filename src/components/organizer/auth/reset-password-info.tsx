"use client";

import { Lock, Shield, CheckCircle, Key } from "lucide-react";

export default function ResetPasswordInfo() {
  return (
    <div className="flex items-center justify-center p-6 lg:p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-md space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Create New Password</h2>
          <p className="text-xl text-indigo-100">
            Set a strong, secure password to protect your organizer account and event data.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Strong Password</h3>
              <p className="text-indigo-100">
                Create a password with uppercase, lowercase, numbers, and special characters for maximum security.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Account Protection</h3>
              <p className="text-indigo-100">
                A secure password protects your events, attendee data, and revenue information.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Instant Access</h3>
              <p className="text-indigo-100">
                Once reset, you'll have immediate access to your organizer dashboard and all features.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <Key className="w-5 h-5" />
            <span className="font-semibold">
              Password Security Tips
            </span>
          </div>
          <p className="text-indigo-100 text-sm">
            Use a unique password you haven't used elsewhere. Consider using a password manager for better security.
          </p>
        </div>
      </div>
    </div>
  );
}