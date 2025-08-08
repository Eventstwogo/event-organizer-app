"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  DollarSign,
  Calendar,
  Users,
  Activity,
} from "lucide-react";
import { PerformanceMetricsData } from "@/hooks/use-analytics";

interface PerformanceMetricsProps {
  data: PerformanceMetricsData | null;
  isLoading: boolean;
  error: string | null;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data, isLoading, error }) => {
  const getTrendIcon = (growth: number) => {
    if (growth > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (growth < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (growth: number) => {
    if (growth > 0) {
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    } else if (growth < 0) {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
    return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  };

  const formatGrowth = (growth: number) => {
    if (growth === 0) return "0%";
    return `${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current vs Previous Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="p-4 rounded-lg border border-border/50 space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-18" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Growth Rates */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center p-4 rounded-lg border border-border/50">
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <Activity className="w-5 h-5 text-purple-500" />
          <CardTitle className="text-base font-semibold text-foreground">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Performance Data Unavailable</h3>
            <p className="text-muted-foreground">
              {error || "Unable to load performance metrics at this time"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-2 pb-4">
        <Activity className="w-5 h-5 text-purple-500" />
        <CardTitle className="text-base font-semibold text-foreground">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current vs Previous Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-border/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              {data.current_period.month}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Events</span>
                <span className="font-semibold text-foreground">{data.current_period.events}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bookings</span>
                <span className="font-semibold text-foreground">{data.current_period.bookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="font-semibold text-foreground">${data.current_period.revenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              {data.previous_period.month}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Events</span>
                <span className="font-semibold text-foreground">{data.previous_period.events}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bookings</span>
                <span className="font-semibold text-foreground">{data.previous_period.bookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="font-semibold text-foreground">${data.previous_period.revenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Rates */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Growth Rates
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
              <span className="text-sm text-muted-foreground">Events</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(data.growth_rates.events_growth)}
                <Badge className={getTrendColor(data.growth_rates.events_growth)}>
                  {formatGrowth(data.growth_rates.events_growth)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
              <span className="text-sm text-muted-foreground">Bookings</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(data.growth_rates.bookings_growth)}
                <Badge className={getTrendColor(data.growth_rates.bookings_growth)}>
                  {formatGrowth(data.growth_rates.bookings_growth)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(data.growth_rates.revenue_growth)}
                <Badge className={getTrendColor(data.growth_rates.revenue_growth)}>
                  {formatGrowth(data.growth_rates.revenue_growth)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-500" />
            Key Performance Indicators
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg border border-border/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <div className="text-2xl font-bold text-foreground mb-1">
                {data.key_performance_indicators.average_bookings_per_event.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Bookings/Event</div>
            </div>
            <div className="text-center p-4 rounded-lg border border-border/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <div className="text-2xl font-bold text-foreground mb-1">
                ${data.key_performance_indicators.average_revenue_per_event.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Avg Revenue/Event</div>
            </div>
            <div className="text-center p-4 rounded-lg border border-border/50 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
              <div className="text-2xl font-bold text-foreground mb-1">
                ${data.key_performance_indicators.average_revenue_per_booking.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Avg Revenue/Booking</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;