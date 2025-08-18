"use client";

import { useState } from "react";
import { Calendar, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FeaturedEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  eventStartDate: string;
  eventEndDate: string;
  onConfirm: (startDate: string, endDate: string, totalCost: number) => void;
}

export function FeaturedEventModal({
  isOpen,
  onClose,
  eventName,
  eventStartDate,
  eventEndDate,
  onConfirm,
}: FeaturedEventModalProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [error, setError] = useState<string>("");

  const calculateWeeks = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    if (start > end) {
      setError("End date must be after start date");
      return 0;
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.ceil(diffDays / 7));
  };

  const weeks = calculateWeeks();
  const totalCost = weeks * 25;

  const handleConfirm = () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const eventStart = new Date(eventStartDate);
    const eventEnd = new Date(eventEndDate);

    if (start < eventStart || end > eventEnd) {
      setError("Selected dates must be within the event's start and end dates");
      return;
    }

    if (start > end) {
      setError("End date must be after start date");
      return;
    }

    setError("");
    onConfirm(startDate, endDate, totalCost);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <CardTitle id="modal-title" className="text-lg">
              Make this Event Featured
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <Label
            id="modal-description"
            className="text-sm font-medium text-muted-foreground bg-muted p-3 rounded-md font-bold"
          >
            Featuring an event costs $25 per week (not calculated per day).
          </Label>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Event Name
            </Label>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{eventName}</p>
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Featured Period
            </Label>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label
                  htmlFor="start-date"
                  className="text-xs text-muted-foreground"
                >
                  Start Date
                </Label>
                <Input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={eventStartDate}
                  max={eventEndDate}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="end-date"
                  className="text-xs text-muted-foreground"
                >
                  End Date
                </Label>
                <Input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={eventStartDate}
                  max={eventEndDate}
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Pricing Information */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">
                {weeks > 0 ? `${weeks} week${weeks > 1 ? "s" : ""}` : "-"}
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-medium">Total Cost:</span>
              <span className="text-lg font-bold text-primary">
                {weeks > 0 ? `$${totalCost}` : "$0"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!startDate || !endDate || !!error}
              className="flex-1"
            >
              Feature Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}