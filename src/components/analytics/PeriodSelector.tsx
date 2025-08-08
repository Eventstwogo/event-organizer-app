"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { AnalyticsPeriod } from "@/hooks/use-analytics";

interface PeriodSelectorProps {
  selectedPeriod: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  dateRange?: {
    start_date: string;
    end_date: string;
  } | null;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  dateRange,
}) => {
  const periods: { value: AnalyticsPeriod; label: string; description: string }[] = [
    { value: "7d", label: "7 Days", description: "Last week" },
    { value: "30d", label: "30 Days", description: "Last month" },
    { value: "90d", label: "90 Days", description: "Last quarter" },
    { value: "1y", label: "1 Year", description: "Last year" },
  ];

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const formatOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: startDate.getFullYear() !== endDate.getFullYear() ? "numeric" : undefined,
    };
    
    return `${startDate.toLocaleDateString("en-US", formatOptions)} - ${endDate.toLocaleDateString("en-US", formatOptions)}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <div>
          <h3 className="font-medium text-foreground">Analytics Period</h3>
          {dateRange && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDateRange(dateRange.start_date, dateRange.end_date)}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        {periods.map((period) => (
          <Button
            key={period.value}
            variant={selectedPeriod === period.value ? "default" : "outline"}
            size="sm"
            onClick={() => onPeriodChange(period.value)}
            className="relative"
          >
            {period.label}
            {selectedPeriod === period.value && (
              <Badge
                variant="secondary"
                className="ml-2 bg-white/20 text-white text-xs px-1.5 py-0.5"
              >
                Active
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PeriodSelector;