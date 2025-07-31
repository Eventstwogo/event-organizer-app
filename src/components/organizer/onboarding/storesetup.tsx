"use client";
import Image from "next/image";
import type React from "react";

import { Calendar, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step1Props {
  storeDetails: {
    storeName: string;
    storeUrl: string;
    location: string;
    industry_id: string; 
  };
  setStoreDetails: React.Dispatch<
    React.SetStateAction<{
      storeName: string;
      storeUrl: string;
      location: string;
      industry_id: string;
    }>
  >;
  onNext: () => void;
}


export default function Step1StoreSetup({
  storeDetails,
  setStoreDetails,
  onNext,
}: Step1Props) {
  const handleSubmit = () => {
    if (
      storeDetails.storeName &&
      storeDetails.storeUrl &&
      // storeDetails.industry_id &&
      storeDetails.location
    ) {
      onNext();
    } else {
      alert("Please fill in all event organizer details.");
    }
  };




  return (
    <div className="w-full h-full lg:grid lg:grid-cols-2">
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
            Join thousands of event organizers who trust our platform to bring their events to life and connect with audiences.
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
            <p className="text-lg text-gray-600">Let's set up your event organizer profile.</p>
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
              className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200"
              required
            />
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
