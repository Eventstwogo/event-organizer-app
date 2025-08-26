"use client";

import { TrendingUp, Users, Calendar, Ticket, Star } from "lucide-react";

export default function VendorLoginComponent() {
  return (
    <div className="hidden lg:flex bg-gradient-to-br from-purple-500 via-indigo-600 to-violet-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="flex flex-col items-center justify-center ml-10  p-12 relative z-10 text-white">
        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-sm">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold leading-tight">
             “Hop In. Leap Ahead. Live the Experience.”
            </h2>
            <p className="text-xl text-purple-100 leading-relaxed">
              Join thousands of successful event organizers who've brought their
              vision to life with our comprehensive event platform.
            </p>
          </div>

          {/* Success metrics with icons */}
         <div className="grid grid-cols-2 gap-6 pt-8">
  <div className="text-center space-y-2">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
      <Calendar className="w-6 h-6" />
    </div>
    <div className="text-lg font-semibold">Smart Scheduling</div>
    <div className="text-purple-100 text-sm">
      Plan, update, and manage events with ease.
    </div>
  </div>

  <div className="text-center space-y-2">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
      <Ticket className="w-6 h-6" />
    </div>
    <div className="text-lg font-semibold">Seamless Ticketing</div>
    <div className="text-purple-100 text-sm">
      Sell and scan tickets effortlessly in real time.
    </div>
  </div>

  <div className="text-center space-y-2">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
      <Users className="w-6 h-6" />
    </div>
    <div className="text-lg font-semibold">Audience Engagement</div>
    <div className="text-purple-100 text-sm">
      Keep attendees connected before and after events.
    </div>
  </div>

  <div className="text-center space-y-2">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
      <TrendingUp className="w-6 h-6" />
    </div>
    <div className="text-lg font-semibold">Growth Insights</div>
    <div className="text-purple-100 text-sm">
      Track performance with powerful analytics.
    </div>
  </div>
</div>


          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-8">
            <p className="text-purple-100 italic mb-3">
              "E2GO Events helped me organize my first music festival with over
              5,000 attendees. The platform made everything seamless!"
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">MR</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Michael Rodriguez</div>
                <div className="text-purple-200 text-xs">
                  Music Festival Organizer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
