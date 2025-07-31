"use client";

import { Shield, CheckCircle, Zap, Users } from "lucide-react";

export default function EmailConfirmationInfo() {
  return (
    <div className="flex items-center justify-center p-6 lg:p-8 bg-gradient-to-br from-emerald-600 to-blue-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-md space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Verify Your Organizer Email</h2>
          <p className="text-xl text-emerald-100">
            Email verification helps you manage events securely and earn
            attendee trust.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Event Security</h3>
              <p className="text-emerald-100">
                Verified email enables account recovery and secure communication
                with attendees.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                Verified Organizer Badge
              </h3>
              <p className="text-emerald-100">
                Gain visibility with verified status and boost attendee trust
                for your events.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Instant Updates</h3>
              <p className="text-emerald-100">
                Receive real-time updates for ticket bookings, attendee queries,
                and platform alerts.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <Users className="w-5 h-5" />
            <span className="font-semibold">
              Join 5,000+ Verified Organizers
            </span>
          </div>
          <p className="text-emerald-100 text-sm">
            Verified organizers host over 15,000 events monthly across concerts,
            workshops, and more!
          </p>
        </div>
      </div>
    </div>
  );
}
