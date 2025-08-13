"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import VendorLoginComponent from "@/components/organizer/auth/login";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosinstance";
import useStore from "@/lib/Zustand";
import {jwtDecode} from "jwt-decode"
export default function EventOrganizerLogin() {
  const { login } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // const [emailValid, setEmailValid] = useState<boolean>(false);
  const router = useRouter();

  // const validateEmail = (email: string) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   setEmailValid(emailRegex.test(email));
  // };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username || !password) {
      toast.error("Username and password are required.");
      return;
    }

    setLoading(true);
    try {
      const data = new URLSearchParams();
      data.append("grant_type", "password");
      data.append("username", username);
      data.append("password", password);
      data.append("scope", "");
      data.append("client_id", "");
      data.append("client_secret", "");

      const response = await axiosInstance.post(
        "/admin/login",
        data.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        const { access_token, organizer_info } = response.data;
        
        const decoded: { rid: string } = jwtDecode(access_token);
  
 
  if (decoded.rid !== '7t94rb') {
    toast.error("Unauthorized role. Only consultants can log in here.");
      

    return;
  }
 
        if (!access_token) {
          throw new Error("Invalid response: Missing access token");
        }

        // Call the login function with access_token and organizer_info
        login(
          access_token,
          organizer_info || {
            is_approved: -1,
            ref_number: "",
            onboarding_status: "unknown",
          }
        );

        toast.success("Login successful.");

        // Redirect based on onboarding_status
        console.log(organizer_info)
        const status = organizer_info?.is_approved || "unknown";
        console.log(status)
    
        switch (status) {
          case 2:
            router.push("/dashboard");
            break;
          case 0:
            router.push("/verification");
            break;
          case 1:
            router.push(`/hold?ref=${encodeURIComponent(organizer_info?.ref_number || "N/A")}`)
            break;
          case -1:
            router.push(
              `/rejected?ref=${encodeURIComponent(
                organizer_info?.ref_number || "N/A"
              )}&comment=${encodeURIComponent(organizer_info?.reviewer_comment || "")}`
            );
            break;
        
          case "not_started":
          case "unknown":
          default:
            router.push("/onboarding");
            break;
        }
      }
    } catch (error: any) {
      const detail = error.response?.data.message
      console.log(detail)
      let errorMessage =error.response?.data.message|| "Something went wrong. Please try again.";

      if (Array.isArray(detail)) {
        errorMessage = detail.map((d) => d.msg).join(" | ");
      } else if (typeof detail === "string") {
        errorMessage = detail;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <VendorLoginComponent />
      <div className="flex items-center justify-center p-6 lg:p-8 relative">
        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-10 animate-pulse delay-1000"></div>

        <div className="mx-auto w-full max-w-md space-y-8 relative z-10">
     
          <form onSubmit={handleSubmit}>
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-lg">
            <img src="/logo.png" alt="Logo" className="w-40 mx-auto "/>
              <CardContent className="px-8 space-y-2">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Event Organizer 
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Access your event management dashboard
                  </p>
                </div>

                <div className="space-y-5">
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700"
                  >
                Email
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter email"
                    className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200"
                    required
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPassword(val);
                        }}
                        placeholder="Enter your password"
                        className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    New event organizer?{" "}
                    <Link
                      href="/signup"
                      className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                    >
                      Start Creating Events
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>

          <div className="text-center">
            <Link
              href="/customer"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Looking for events? Browse events →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
