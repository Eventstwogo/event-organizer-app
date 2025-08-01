"use client";
import Image from "next/image";
import type React from "react";
import { Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step2Props {
  generalQuestions: {
    mainGoals: string[];
  };
  setGeneralQuestions: React.Dispatch<
    React.SetStateAction<{
      mainGoals: string[];
    }>
  >;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Goals({
  generalQuestions,
  setGeneralQuestions,
  onNext,
  onBack,
}: Step2Props) {
  const goals = [
    "Sell Event Tickets",
    "Build Event Community",
    "Promote Brand Events",
    "Increase Event Attendance",
    "Manage Event Registrations",
    "Create Recurring Events",
    "Corporate Event Planning",
    "Entertainment Events",
  ];

  const handleGoalToggle = (goal: string) => {
    setGeneralQuestions((prev) => {
      const newGoals = prev.mainGoals.includes(goal)
        ? prev.mainGoals.filter((g) => g !== goal)
        : [...prev.mainGoals, goal];
      return { ...prev, mainGoals: newGoals };
    });
  };

  const handleSubmit = () => {
    if (generalQuestions.mainGoals.length > 0) {
      onNext();
    } else {
      alert("Please select at least one goal.");
    }
  };

  return (
    <div className="w-full min-h-screen lg:h-full lg:grid lg:grid-cols-2">
      {/* Image Side */}
      <div className="hidden lg:flex items-center justify-center p-4 xl:p-8 bg-gradient-to-br from-purple-50 to-indigo-50 h-full">
        <div className="text-center space-y-4 xl:space-y-6 max-w-md">
          <Image
            src="/images/goals.jpg"
            alt="Event goals and objectives illustration"
            width={400}
            height={400}
            className="mx-auto rounded-lg shadow-lg w-full max-w-sm xl:max-w-md"
          />
          <h2 className="text-2xl xl:text-3xl font-bold text-gray-800">
            Define Your Event Goals
          </h2>
          <p className="text-gray-600 text-base xl:text-lg">
            Tell us about your event objectives so we can customize the perfect
            tools and features for your success.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen lg:h-full">
        <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl mb-2 sm:mb-4 shadow-lg mx-auto">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent px-2">
              What are your event goals?
            </h1>
            <p className="text-base sm:text-lg text-gray-600 px-2">
              Select all that apply to your event organizing needs:
            </p>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-280px)]">
            {goals.map((goal) => (
              <Button
                key={goal}
                variant={
                  generalQuestions.mainGoals.includes(goal)
                    ? "default"
                    : "outline"
                }
                onClick={() => handleGoalToggle(goal)}
                className={cn(
                  "h-10 sm:h-12 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium px-2 sm:px-4",
                  generalQuestions.mainGoals.includes(goal)
                    ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md"
                    : "border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                )}
              >
                <span className="text-center leading-tight">{goal}</span>
              </Button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="h-10 sm:h-12 w-full sm:w-auto sm:min-w-[100px] border-2 border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors duration-200 order-2 sm:order-1"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="h-10 sm:h-12 w-full sm:w-auto sm:min-w-[140px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] order-1 sm:order-2"
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
