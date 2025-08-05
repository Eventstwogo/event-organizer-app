"use client";

import { Store, Users, Trophy, CheckCircle } from "lucide-react";

export default function VendorSignupComponent() {
  return (
    <div className="hidden lg:flex bg-gradient-to-br from-purple-500 via-indigo-600 to-violet-700 relative overflow-hidden">
      {/* Enhanced Image Side */}

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="flex flex-col items-center justify-center p-12 relative z-10 text-white">
        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-sm">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              Your Success Story Starts Here
            </h2>
            <p className="text-xl text-purple-100 leading-relaxed">
              Join our thriving marketplace and discover the tools, support, and
              community you need to build an amazing business.
            </p>
          </div>

          {/* Benefits with icons */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-purple-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Easy Setup</div>
                <div className="text-purple-100 text-sm">
                  Get your store live in under 10 minutes
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex-shrink-0">
                <Trophy className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Premium Tools</div>
                <div className="text-purple-100 text-sm">
                  Advanced analytics and marketing features
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex-shrink-0">
                <Users className="w-6 h-6 text-indigo-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold">24/7 Support</div>
                <div className="text-purple-100 text-sm">
                  Dedicated support team always ready to help
                </div>
              </div>
            </div>
          </div>

          {/* Success metrics */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold">$0</div>
              <div className="text-purple-200 text-xs">Setup Fee</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold">5%</div>
              <div className="text-purple-200 text-xs">Commission</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold">∞</div>
              <div className="text-purple-200 text-xs">Potential</div>
            </div>
          </div>

          {/* New vendor testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-8">
            <p className="text-purple-100 italic mb-3">
              "I went from zero to $10K monthly revenue in just 3 months. The
              platform made everything so simple!"
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">MR</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Mike Rodriguez</div>
                <div className="text-purple-200 text-xs">
                  Electronics Store Owner
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
