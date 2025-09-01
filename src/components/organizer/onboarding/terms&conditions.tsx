"use client"

import * as React from "react"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface StepTermsProps {
  onNext: () => void
  onBack: () => void
  className?: string
}

export default function StepTerms({ onNext, onBack, className }: StepTermsProps) {
  const [scrolledToEnd, setScrolledToEnd] = React.useState(false)
  const [agree, setAgree] = React.useState(false)
  const [announce, setAnnounce] = React.useState<string>("")
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const scrollRef = React.useRef<HTMLDivElement | null>(null)

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget
    const max = el.scrollHeight - el.clientHeight
    const pct = max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 0
    setScrollProgress(pct)

    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
    if (atBottom && !scrolledToEnd) {
      setScrolledToEnd(true)
      setAnnounce("You’ve reached the end of the Terms & Conditions. You may now confirm your agreement to proceed.")
    }
  }

  const handleNext = () => {
    if (agree) onNext()
  }

  return (
    <main className={cn("w-full min-h-screen flex items-center justify-center bg-gray-50 p-6", className)}>
      <section className="w-full max-w-3xl space-y-6 bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl mb-2 sm:mb-4 shadow-lg mx-auto">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Please review our Terms & Conditions carefully to proceed.
          </p>
        </header>

        {/* Screen reader announcement */}
        <p className="sr-only" aria-live="polite">
          {announce} Reading progress: {scrollProgress}%.
        </p>

        {/* Terms card */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          {/* Reading progress bar */}
          <div aria-hidden="true" className="h-1 bg-gray-100">
            <div 
              className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ease-out" 
              style={{ width: `${scrollProgress}%` }} 
            />
          </div>

          {/* Scrollable region */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="max-h-[50vh] sm:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            aria-label="Terms and Conditions"
            role="region"
            aria-describedby={!scrolledToEnd ? "scroll-hint" : undefined}
            tabIndex={0}
          >
            <div className="p-6 space-y-6 text-base leading-relaxed text-gray-700">
              <section>
                <h3 className="text-lg font-semibold text-gray-900">1. Introduction</h3>
                <p>
                  These Terms & Conditions govern your use of our platform. By accessing or using our services, 
                  you agree to be bound by these terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">2. Liability</h3>
                <p>
                  To the maximum extent permitted by law, we are not liable for indirect or consequential damages. 
                  Your use of the platform is at your own risk.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">3. Changes</h3>
                <p>
                  We may update these terms periodically. Continued use after changes constitutes acceptance of the 
                  updated terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">4. Contact</h3>
                <p>
                  If you have questions regarding these terms, please contact our support team at 
                  <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">support@example.com</a>.
                </p>
              </section>
                <section>
                <h3 className="text-lg font-semibold text-gray-900">1. Introduction</h3>
                <p>
                  These Terms & Conditions govern your use of our platform. By accessing or using our services, 
                  you agree to be bound by these terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">2. Liability</h3>
                <p>
                  To the maximum extent permitted by law, we are not liable for indirect or consequential damages. 
                  Your use of the platform is at your own risk.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">3. Changes</h3>
                <p>
                  We may update these terms periodically. Continued use after changes constitutes acceptance of the 
                  updated terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">4. Contact</h3>
                <p>
                  If you have questions regarding these terms, please contact our support team at 
                  <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">support@example.com</a>.
                </p>
              </section>
                <section>
                <h3 className="text-lg font-semibold text-gray-900">1. Introduction</h3>
                <p>
                  These Terms & Conditions govern your use of our platform. By accessing or using our services, 
                  you agree to be bound by these terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">2. Liability</h3>
                <p>
                  To the maximum extent permitted by law, we are not liable for indirect or consequential damages. 
                  Your use of the platform is at your own risk.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">3. Changes</h3>
                <p>
                  We may update these terms periodically. Continued use after changes constitutes acceptance of the 
                  updated terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">4. Contact</h3>
                <p>
                  If you have questions regarding these terms, please contact our support team at 
                  <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">support@example.com</a>.
                </p>
              </section>
                <section>
                <h3 className="text-lg font-semibold text-gray-900">1. Introduction</h3>
                <p>
                  These Terms & Conditions govern your use of our platform. By accessing or using our services, 
                  you agree to be bound by these terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">2. Liability</h3>
                <p>
                  To the maximum extent permitted by law, we are not liable for indirect or consequential damages. 
                  Your use of the platform is at your own risk.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">3. Changes</h3>
                <p>
                  We may update these terms periodically. Continued use after changes constitutes acceptance of the 
                  updated terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">4. Contact</h3>
                <p>
                  If you have questions regarding these terms, please contact our support team at 
                  <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">support@example.com</a>.
                </p>
              </section>
                <section>
                <h3 className="text-lg font-semibold text-gray-900">1. Introduction</h3>
                <p>
                  These Terms & Conditions govern your use of our platform. By accessing or using our services, 
                  you agree to be bound by these terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">2. Liability</h3>
                <p>
                  To the maximum extent permitted by law, we are not liable for indirect or consequential damages. 
                  Your use of the platform is at your own risk.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">3. Changes</h3>
                <p>
                  We may update these terms periodically. Continued use after changes constitutes acceptance of the 
                  updated terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">4. Contact</h3>
                <p>
                  If you have questions regarding these terms, please contact our support team at 
                  <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">support@example.com</a>.
                </p>
              </section>
                <section>
                <h3 className="text-lg font-semibold text-gray-900">1. Introduction</h3>
                <p>
                  These Terms & Conditions govern your use of our platform. By accessing or using our services, 
                  you agree to be bound by these terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">2. Liability</h3>
                <p>
                  To the maximum extent permitted by law, we are not liable for indirect or consequential damages. 
                  Your use of the platform is at your own risk.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">3. Changes</h3>
                <p>
                  We may update these terms periodically. Continued use after changes constitutes acceptance of the 
                  updated terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">4. Contact</h3>
                <p>
                  If you have questions regarding these terms, please contact our support team at 
                  <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">support@example.com</a>.
                </p>
              </section>
                <section>
                <h3 className="text-lg font-semibold text-gray-900">1. Introduction</h3>
                <p>
                  These Terms & Conditions govern your use of our platform. By accessing or using our services, 
                  you agree to be bound by these terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">2. Liability</h3>
                <p>
                  To the maximum extent permitted by law, we are not liable for indirect or consequential damages. 
                  Your use of the platform is at your own risk.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">3. Changes</h3>
                <p>
                  We may update these terms periodically. Continued use after changes constitutes acceptance of the 
                  updated terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">4. Contact</h3>
                <p>
                  If you have questions regarding these terms, please contact our support team at 
                  <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">support@example.com</a>.
                </p>
              </section>
                <section>
                <h3 className="text-lg font-semibold text-gray-900">1. Introduction</h3>
                <p>
                  These Terms & Conditions govern your use of our platform. By accessing or using our services, 
                  you agree to be bound by these terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">2. Liability</h3>
                <p>
                  To the maximum extent permitted by law, we are not liable for indirect or consequential damages. 
                  Your use of the platform is at your own risk.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">3. Changes</h3>
                <p>
                  We may update these terms periodically. Continued use after changes constitutes acceptance of the 
                  updated terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900">4. Contact</h3>
                <p>
                  If you have questions regarding these terms, please contact our support team at 
                  <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">support@example.com</a>.
                </p>
              </section>

              <p className="text-gray-500 italic">
                End of Terms & Conditions. Please confirm your agreement below to continue.
              </p>
            </div>
          </div>

          {/* Scroll hint until end is reached */}
          {!scrolledToEnd && (
            <div
              id="scroll-hint"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 border-t border-indigo-100 text-gray-600 text-sm"
            >
              <span>Scroll to the end to unlock the agreement checkbox.</span>
            </div>
          )}
        </div>

        {/* Agreement */}
        <div
          aria-hidden={!scrolledToEnd}
          className={cn(
            "transition-all duration-300 ease-out transform",
            scrolledToEnd ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none select-none",
          )}
        >
          <label htmlFor="agree" className="flex items-start gap-3">
            <Checkbox
              id="agree"
              checked={agree}
              onCheckedChange={(val) => setAgree(Boolean(val))}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              tabIndex={scrolledToEnd ? 0 : -1}
            />
            <span className="text-base text-gray-700">
              I have read and agree to the <span className="font-medium text-indigo-600">Terms & Conditions</span>.
            </span>
          </label>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col sm:flex-row gap-4 sm:gap-3 pt-4 justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="h-12 w-full sm:w-36 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!agree}
            className={cn(
              "h-12 w-full sm:w-36 text-white font-semibold rounded-lg shadow transition-all duration-200",
              "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
              !agree && "opacity-50 cursor-not-allowed hover:from-indigo-500 hover:to-purple-600",
            )}
          >
            Continue
          </Button>
        </nav>
      </section>
    </main>
  )
}