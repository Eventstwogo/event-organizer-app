"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import useStore from "@/lib/Zustand";
import {MessageSquare,
  LayoutGrid,
  Users,
  ShoppingCart,
  ArrowRight,
  Settings,
  Ticket,
  BarChart3,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Minus,
  RefreshCw,
  AlertCircle,
  Bell,
  User as UserIcon,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDashboardStats, useThemeAnimations } from "@/hooks/use-dashboard-stats";
import { useDashboardActivity } from "@/hooks/use-dashboard-activity";
import { 
  useDashboardOverview, 
  usePerformanceMetrics,
  AnalyticsPeriod 
} from "@/hooks/use-analytics";
import { 
  AnalyticsCards, 
  RecentEvents, 
  PeriodSelector, 
  PerformanceMetrics 
} from "@/components/analytics";


// Mock user info (replace with real user data if available)
const user = {
  name: "Event Organizer",
  avatar: null,
  role: "Organizer",
};

// Dashboard skeleton component
const DashboardSkeleton = () => {
  const { userId } = useStore();
  const router = useRouter();



  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Quick actions skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-1 rounded-full" />
          <Skeleton className="h-7 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="pt-8 border-t border-border/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-4 w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </main>
  );
};

const DashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>("30d");
  
  // New analytics hooks
  const { data: overviewData, isLoading: overviewLoading, error: overviewError, refetch: refetchOverview } = useDashboardOverview(selectedPeriod);
  const { data: performanceData, isLoading: performanceLoading, error: performanceError } = usePerformanceMetrics();
  
  // Legacy hooks (keeping for fallback)
  const { formattedStats, isLoading, error, refetch } = useDashboardStats();
  const { activity, isLoading: activityLoading, markNotificationAsRead } = useDashboardActivity();
  const { mounted, getCardHoverClass, getIconAnimationClass, getButtonAnimationClass } = useThemeAnimations();
  const { user: currentUser } = useStore();

  // Use new analytics data if available, fallback to legacy
  const isAnalyticsLoading = overviewLoading || performanceLoading;
  const analyticsError = overviewError || performanceError;

  const getTrendIcon = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const statsConfig = [
    {
      title: "Events",
      icon: <CalendarCheck className="w-6 h-6" />,
      description: "Manage your events and schedules",
      href: "/Events",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient:
        "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Queries",
      icon: <MessageSquare className="w-6 h-6" />,
      description: "Handle customer support queries",
      href: "/queries",
      gradient: "from-green-500 to-emerald-600",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },

  ];

  const quickActions = [
    {
      title: "Create Event",
      icon: <CalendarCheck className="w-5 h-5" />,
      description: "Add new event",
      href: "/Events/BasicInfo",
      color: "text-rose-600 dark:text-rose-400",
    },
    {
      title: "View Bookings",
      icon: <Users className="w-5 h-5" />,
      description: "Manage bookings",
      href: "/bookings",
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Revenue",
      icon: <DollarSign className="w-5 h-5" />,
      description: "Track revenue",
      href: "/revenue",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      description: "View detailed analytics",
      href: "/analytics",
      color: "text-blue-600 dark:text-blue-400",
    },
  ];

  const formattedDate = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isAnalyticsLoading && isLoading) {
    return <DashboardSkeleton />;
  }

  if (analyticsError && error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-muted-foreground mb-4">{analyticsError || error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={refetchOverview} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Analytics
            </Button>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Legacy
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome/User Info Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, <span className="font-semibold text-foreground">{currentUser?.username || user.name}</span>! Here&apos;s an overview of your event organizer dashboard.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <Link href="/Settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Button>
          </Link> */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Live
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-foreground font-medium">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <PeriodSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        dateRange={overviewData?.date_range}
      />

      {/* Analytics Cards */}
      <AnalyticsCards
        data={overviewData}
        isLoading={overviewLoading}
        error={overviewError}
      />

      {/* Recent Events and Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEvents
          data={overviewData}
          isLoading={overviewLoading}
          error={overviewError}
        />
        {/* <PerformanceMetrics
          data={performanceData}
          isLoading={performanceLoading}
          error={performanceError}
        /> */}
      </div>

      {/* Legacy Notifications and Activity (keeping for backward compatibility) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* <Card className="bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-base font-semibold text-foreground">Notifications</CardTitle>
            {activity?.notifications && activity.notifications.filter(n => !n.read).length > 0 && (
              <Badge variant="outline" className="ml-auto bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {activity.notifications.filter(n => !n.read).length} new
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {activityLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            ) : activity?.notifications && activity.notifications.length > 0 ? (
              activity.notifications.slice(0, 3).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg border ${
                    notification.read 
                      ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800' 
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            notification.type === 'error' ? 'text-red-600 border-red-300' :
                            notification.type === 'warning' ? 'text-yellow-600 border-yellow-300' :
                            notification.type === 'success' ? 'text-green-600 border-green-300' :
                            'text-blue-600 border-blue-300'
                          }`}
                        >
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="text-xs h-6 px-2"
                      >
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No new notifications. All systems operational!</div>
            )}
          </CardContent>
        </Card> */}
        
        {/* Recent Activity Section */}
        {/* <Card className="bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base font-semibold text-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                ))}
              </div>
            ) : activity?.recentActivity && activity.recentActivity.length > 0 ? (
              activity.recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <span className={`w-2 h-2 rounded-full ${
                    item.type === 'event' ? 'bg-blue-400 dark:bg-blue-600' :
                    item.type === 'query' ? 'bg-green-400 dark:bg-green-600' :
                    item.type === 'user' ? 'bg-purple-400 dark:bg-purple-600' :
                    item.type === 'ticket' ? 'bg-yellow-400 dark:bg-yellow-600' :
                    'bg-gray-400 dark:bg-gray-600'
                  }`} />
                  <span className="flex-1 text-muted-foreground">{item.message}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{item.time}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No recent activity to display.</div>
            )}
          </CardContent>
        </Card> */}
      </div>

      {/* Quick Actions Section */}
      {/* <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
          <h2 className="text-xl font-semibold text-foreground">
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={action.title} href={action.href}>
              <Card className="p-4 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer border-border/50 hover:border-border group bg-white dark:bg-zinc-900">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors duration-200">
                    <div className={action.color}>{action.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground group-hover:text-foreground/80 transition-colors duration-200">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div> */}

      {/* Footer Section */}
      <div className="pt-8 border-t border-border/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              Last updated: {activity?.systemHealth?.lastUpdate || formattedDate}
            </p>
            {activity?.systemHealth?.uptime && (
              <p className="text-xs text-muted-foreground mt-1">
                System uptime: {activity.systemHealth.uptime}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              activity?.systemHealth?.status === 'online' ? 'bg-green-500' :
              activity?.systemHealth?.status === 'maintenance' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            <span className="text-sm text-muted-foreground">
              System Status: {activity?.systemHealth?.status === 'online' ? 'Online' :
                             activity?.systemHealth?.status === 'maintenance' ? 'Maintenance' :
                             activity?.systemHealth?.status === 'offline' ? 'Offline' : 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
