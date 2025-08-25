"use client";
import Image from "next/image";
import type React from "react";
import { useState, useEffect} from 'react';
import { Calendar, MapPin, LogOut } from "lucide-react";
import axiosInstance from "@/lib/axiosinstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useStore from "@/lib/Zustand";
import { useRouter } from "next/navigation";
 import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { CheckCircle, XCircle, Loader2, Store } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import slugify from "slugify";
import { toast } from "sonner";

interface OrganizerType {
  type_id: string;
  organizer_type: string;
  type_status: boolean;
  created_at: string;
}

{/* Organizer Type Selection */}



interface Step1Props {
  storeDetails: {
    storeName: string;
    storeUrl: string;
    location: string;
    type_ref_id: string;
  };
  setStoreDetails: React.Dispatch<
    React.SetStateAction<{
      storeName: string;
      storeUrl: string;
      location: string;
      type_ref_id: string;
    }>
  >;
  onNext: () => void;
}

export default function Step1StoreSetup({
  storeDetails,
  setStoreDetails,
  onNext,
}: Step1Props) {
  const { logout } = useStore();
  const router = useRouter();
const [organizerTypes, setOrganizerTypes] = useState<OrganizerType[]>([]);
const [loadingTypes, setLoadingTypes] = useState(false);
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSubmit = () => {
    if (
      storeDetails.storeName &&
      storeDetails.storeUrl &&
      storeDetails.type_ref_id &&
      storeDetails.location
    ) {
      onNext();
    } else {
      toast.error("Please fill in all event organizer details.");
    }
  };

  const [storeNameStatus, setStoreNameStatus] = useState<
    "available" | "unavailable" | "checking" | null
  >(null);
useEffect(() => {
  const fetchOrganizerTypes = async () => {
    try {
      setLoadingTypes(true);
      const response = await axiosInstance.get("/organizers/types/active");
      if (response.status === 200) {
        setOrganizerTypes(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching organizer types:", error);
      toast.error("Failed to fetch organizer types");
    } finally {
      setLoadingTypes(false);
    }
  };

  fetchOrganizerTypes();
}, []);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (storeDetails.storeName.trim()) {
        checkStoreNameAvailability(storeDetails.storeName.trim());
      } else {
        setStoreNameStatus(null);
      }
    }, 500); // Debounce by 500ms

    return () => clearTimeout(delayDebounce);
  }, [storeDetails.storeName]);

  const checkStoreNameAvailability = async (name: string) => {
    try {
      setStoreNameStatus("checking");
      const response = await axiosInstance.get(
        `/organizers/store-name-availability?name=${name}`
      );
      console.log(response);
      if (response.status === 200) {
        setStoreNameStatus("available");
        const slug = slugify(name);
        setStoreDetails((prev) => ({
          ...prev,
          storeUrl: slug,
        }));
      } else {
        setStoreNameStatus("unavailable");
      }
    } catch (error) {
      setStoreNameStatus("unavailable");
    }
  };

  return (
    <div className="w-full h-full lg:grid lg:grid-cols-2">
      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 z-10 flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
      
      {/* Image Side */}
      <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50 h-full">
        <div className="text-center space-y-6 max-w-md">
          <Image
            src="/images/events2.jpg"
            alt="Event organizer setup illustration"
            width={400}
            height={400}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h2 className="text-3xl font-bold text-gray-800">
            Create Amazing Events
          </h2>
          <p className="text-gray-600 text-lg">
            Join thousands of event organizers who trust our platform to bring
            their events to life and connect with audiences.
          </p>
        </div>
      </div>
      {/* Form Side */}
      <div className="flex items-center justify-center p-6 lg:p-8 relative h-full">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl mb-4 shadow-lg mx-auto">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Event Organizer!
            </h1>
            <p className="text-lg text-gray-600">
              Let's set up your event organizer profile.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeName">Organization Name</Label>
            <Input
              id="storeName"
              placeholder="Amazing Events Co."
              value={storeDetails.storeName}
              onChange={(e) =>
                setStoreDetails({
                  ...storeDetails,
                  storeName: e.target.value,
                })
              }
              className={`h-12 border-2 pr-10 ${
                storeNameStatus === "available"
                  ? "border-green-500 focus:border-green-500"
                  : storeNameStatus === "unavailable"
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              } transition-colors duration-200`}
              required
            />
            {storeNameStatus === "checking" && (
              <Loader2 className="absolute right-3 top-3 w-5 h-5 text-blue-500 animate-spin" />
            )}

            {storeNameStatus === "available" && (
              <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
            )}

            {storeNameStatus === "unavailable" && (
              <XCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="storeUrl">Event Organizer Profile URL</Label>
            <div className="flex w-full">
              <span className="inline-flex items-center px-3 h-12 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                https://e2go.events/
              </span>
              <Input
                id="storeUrl"
                placeholder="amazing-events"
                value={storeDetails.storeUrl}
                onChange={(e) =>
                  setStoreDetails({
                    ...storeDetails,
                    storeUrl: e.target.value,
                  })
                }
                className="h-12 w-full border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200 rounded-r-md rounded-l-none"
                required
              />
            </div>
          </div>
{/* Organizer Type Selection */}
{/* Organizer Type Selection */}
<div className="space-y-2">
  <Label>Organizer Type</Label>

  <div className="border-2 border-gray-200 rounded-lg p-4">
    {loadingTypes ? (
      <p className="text-sm text-gray-500">Loading organizer types...</p>
    ) : organizerTypes.length > 0 ? (
      <RadioGroup
        value={storeDetails.type_ref_id}
        onValueChange={(value) =>
          setStoreDetails({ ...storeDetails, type_ref_id: value })
        }
      >
        {organizerTypes.map((type) => (
          <div key={type.type_id} className="flex items-center space-x-2">
            <RadioGroupItem value={type.type_id} id={type.type_id} />
            <Label htmlFor={type.type_id}>{type.organizer_type}</Label>
          </div>
        ))}
      </RadioGroup>
    ) : (
      <p className="text-sm text-gray-500">No organizer types available</p>
    )}
  </div>

  <p className="text-sm text-muted-foreground mt-1">
    Choose what best describes your organization.
  </p>
</div>


          {/* Location Selection */}
          <div className="space-y-2">
            <Label htmlFor="location">Primary Operating Location</Label>
            <Select
              value={storeDetails.location}
              onValueChange={(value) =>
                setStoreDetails({ ...storeDetails, location: value })
              }
            >
              <SelectTrigger className="h-12 w-full border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200">
                <SelectValue placeholder="Select your primary city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sydney">Sydney</SelectItem>
                <SelectItem value="melbourne">Melbourne</SelectItem>
                <SelectItem value="brisbane">Brisbane</SelectItem>
                <SelectItem value="perth">Perth</SelectItem>
                <SelectItem value="adelaide">Adelaide</SelectItem>
                <SelectItem value="hobart">Hobart</SelectItem>
                <SelectItem value="darwin">Darwin</SelectItem>
                <SelectItem value="canberra">Canberra</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              The primary city where you organize most of your events.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full h-12  bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            Create Event Organizer Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
