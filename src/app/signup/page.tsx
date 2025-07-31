"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Calendar, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import EventOrganizerSignupComponent from "@/components/organizer/auth/signup";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "sonner";

export default function EventOrganizerSignup() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>(""); // New state
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!username || !password) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/organizers/auth/register", {
        username,
        email,
        password, // Use password instead of role
      });

      if (response.status === 201) {
        toast.success(
          "Welcome to E2GO! Please check your email to verify your account."
        );
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail?.message ||
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2 bg-gradient-to-br from-purple-50 to-indigo-100">
      <EventOrganizerSignupComponent />
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 relative min-h-screen lg:min-h-auto">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="mx-auto w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8 relative z-10">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Join Us!
              </h1>
              <p className="text-lg text-gray-600">
                Get started by creating your account and start organizing
                incredible events.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Event Organizer Sign Up
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Create your account
                  </p>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-gray-700"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEmail(val);
                        validateEmail(val);
                      }}
                      placeholder="your.events@example.com"
                      required
                    />
                    {email && (
                      <div className="mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            emailValid
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {emailValid ? "Valid email" : "Invalid email format"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 sm:h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg"
                  >
                    {loading
                      ? "Creating Account..."
                      : "Start Organizing Events"}
                  </Button>
                </div>

                <div className="text-center pt-3 sm:pt-4">
                  <p className="text-sm sm:text-base text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/"
                      className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                    >
                      Sign In Here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
