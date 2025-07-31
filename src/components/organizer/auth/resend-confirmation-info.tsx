"use client";

import { Mail, Clock, HelpCircle, ArrowRight } from "lucide-react";

export default function ResendConfirmationInfo() {
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
          <h2 className="text-3xl font-bold">Didn't Get the Email?</h2>
          <p className="text-xl text-purple-100">
            Trouble receiving the confirmation email? Here's how to fix it.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Allow Some Time</h3>
              <p className="text-purple-100">
                Emails may take up to 5 minutes. If it doesn’t arrive
                immediately, please wait a bit.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                Check Spam or Promotions
              </h3>
              <p className="text-purple-100">
                Sometimes our emails land in spam or promotions tab. Don’t
                forget to look there!
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Try Another Email</h3>
              <p className="text-purple-100">
                If you're using a corporate or institutional email, try with
                your personal email.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Still Need Assistance?</span>
            <ArrowRight className="w-5 h-5" />
          </div>
          <p className="text-purple-100 text-sm mb-3">
            Our support team is available 24/7 to assist with email delivery and
            verification issues.
          </p>
          <button className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
