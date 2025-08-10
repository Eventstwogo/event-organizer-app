"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarCheck,
  Users,
  DollarSign,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Activity,
} from "lucide-react";
import { DashboardOverviewData } from "@/hooks/use-analytics";
import Link from "next/link";

interface AnalyticsCardsProps {
  data: DashboardOverviewData | null;
  isLoading: boolean;
  error: string | null;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ data, isLoading, error }) => {
  const getTrendIcon = (current: number, previous: number = 0) => {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendPercentage = (current: number, previous: number = 0) => {
    if (previous === 0) return null;
    const percentage = ((current - previous) / previous) * 100;
    return percentage.toFixed(1);
  };

  const statsConfig = [
    {
      title: "Events",
      icon: <CalendarCheck className="w-6 h-6" />,
      description: "Total events managed",
      href: "/Events",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      getValue: () => data?.event_statistics.total_events || 0,
      getTrend: () => `${data?.event_statistics.upcoming_events || 0} upcoming`,
      getSubInfo: () => `${data?.event_statistics.active_events || 0} active`,
    },
    {
      title: "Bookings",
      icon: <Users className="w-6 h-6" />,
      description: "Total bookings received",
      href: "/bookings",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      getValue: () => data?.booking_statistics.total_bookings || 0,
      getTrend: () => `${data?.booking_statistics.approved_bookings || 0} approved`,
      getSubInfo: () => `${data?.booking_statistics.approval_rate || 0}% approval rate`,
    },
    {
      title: "Revenue",
      icon: <DollarSign className="w-6 h-6" />,
      description: "Total revenue generated",
      href: "/revenue",
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      getValue: () => data?.revenue_statistics.total_revenue || 0,
      getTrend: () => `$${data?.revenue_statistics.pending_revenue || 0} pending`,
      getSubInfo: () => `$${data?.revenue_statistics.average_booking_value || 0} avg booking`,
    },
    {
      title: "Queries",
      icon: <MessageSquare className="w-6 h-6" />,
      description: "Customer support queries",
      href: "/queries",
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      getValue: () => data?.query_statistics.total_queries || 0,
      getTrend: () => `${data?.query_statistics.pending_queries || 0} pending`,
      getSubInfo: () => `${data?.query_statistics.resolution_rate || 0}% resolved`,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-0 bg-gradient-to-br from-muted/50 to-muted/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent" />
            <CardHeader className="relative flex flex-row items-center justify-between pb-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </CardHeader>
            <CardContent className="relative space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((config, index) => (
          <Card
            key={config.title}
            className={`relative overflow-hidden border-0 bg-gradient-to-br ${config.bgGradient} opacity-50`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent" />
            <CardHeader className="relative flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-foreground/80">
                  {config.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">--</span>
                  <Minus className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">Data unavailable</p>
                </div>
              </div>
              <div className={`p-3 rounded-full ${config.iconBg}`}>
                <div className={config.iconColor}>{config.icon}</div>
              </div>
            </CardHeader>
            <CardContent className="relative pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {config.description}
              </p>
              <Button variant="secondary" className="w-full" disabled>
                <span>Go to {config.title}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((config, index) => {
        const value = config.getValue();
        const trend = config.getTrend();
        const subInfo = config.getSubInfo();
        
        return (
          <Card
            key={config.title}
            className={`relative overflow-hidden border-0 bg-gradient-to-br ${
              config.bgGradient
            } group transition-all duration-200 hover:shadow-lg hover:scale-[1.02] dark:hover:shadow-black/30`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent" />
            <CardHeader className="relative flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-foreground/80">
                  {config.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {config.title === "Revenue" ? `$${value.toLocaleString()}` : value.toLocaleString()}
                  </span>
                  {getTrendIcon(value)}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{trend}</p>
                  {subInfo && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {subInfo}
                    </Badge>
                  )}
                </div>
              </div>
              <div
                className={`p-3 rounded-full ${config.iconBg} group-hover:scale-110 transition-transform duration-300 ease-out`}
              >
                <div className={config.iconColor}>{config.icon}</div>
              </div>
            </CardHeader>
            <CardContent className="relative pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {config.description}
              </p>
              <Link href={config.href}>
                <Button
                  variant="secondary"
                  className="w-full group/btn hover:bg-background/80 dark:hover:bg-background/80 transition-all duration-200"
                >
                  <span>Go to {config.title}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200 ease-out" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AnalyticsCards;