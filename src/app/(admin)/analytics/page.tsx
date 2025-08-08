"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  MessageSquare,
  TrendingUp,
  RefreshCw,
  Download,
  Filter,
  Eye,
} from "lucide-react";
import {
  useDashboardOverview,
  useEventAnalytics,
  useBookingAnalytics,
  useQueryAnalytics,
  usePerformanceMetrics,
  AnalyticsPeriod,
} from "@/hooks/use-analytics";
import { PeriodSelector, PerformanceMetrics } from "@/components/analytics";
import Image from "next/image";

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>("30d");

  // Analytics hooks
  const { data: overviewData, isLoading: overviewLoading, error: overviewError, refetch: refetchOverview } = useDashboardOverview(selectedPeriod);
  const { data: eventData, isLoading: eventLoading, error: eventError } = useEventAnalytics(selectedPeriod);
  const { data: bookingData, isLoading: bookingLoading, error: bookingError } = useBookingAnalytics(selectedPeriod);
  const { data: queryData, isLoading: queryLoading, error: queryError } = useQueryAnalytics(selectedPeriod);
  const { data: performanceData, isLoading: performanceLoading, error: performanceError } = usePerformanceMetrics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "HEALTH AND WELLNESS": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      "TECHNOLOGY": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      "BUSINESS": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "ENTERTAINMENT": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      "EDUCATION": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      "SPORTS": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-500/25">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive insights into your event organizer performance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={refetchOverview}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <PeriodSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        dateRange={overviewData?.date_range}
      />

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="queries">Queries</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewData?.event_statistics.total_events || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {overviewData?.event_statistics.active_events || 0} active
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Users className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewData?.booking_statistics.total_bookings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {overviewData?.booking_statistics.approval_rate || 0}% approval rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="w-4 h-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(overviewData?.revenue_statistics.total_revenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(overviewData?.revenue_statistics.pending_revenue || 0)} pending
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
                <MessageSquare className="w-4 h-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewData?.query_statistics.total_queries || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {overviewData?.query_statistics.resolution_rate || 0}% resolved
                </p>
              </CardContent>
            </Card>
          </div>

          <PerformanceMetrics
            data={performanceData}
            isLoading={performanceLoading}
            error={performanceError}
          />
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Event Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eventLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : eventData?.event_performance?.length ? (
                  eventData.event_performance.slice(0, 5).map((event) => (
                    <div key={event.event_id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        {event.card_image ? (
                          <Image
                            src={event.card_image}
                            alt={event.event_title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{event.event_title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(event.category_name)}>
                            {event.category_name}
                          </Badge>
                          <Badge variant={event.event_status ? "default" : "secondary"}>
                            {event.event_status ? "Active" : "Draft"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{event.total_bookings} bookings</span>
                          <span>{formatCurrency(event.total_revenue)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No event data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popular Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Popular Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eventLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : eventData?.popular_categories?.length ? (
                  eventData.popular_categories.map((category) => (
                    <div key={category.category_name} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                      <div>
                        <h4 className="font-medium text-foreground">{category.category_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category.event_count} events • {category.total_bookings} bookings
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          {formatCurrency(category.total_revenue)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No category data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="animate-pulse flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : bookingData ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Total Bookings</span>
                      <span className="font-semibold">{bookingData.booking_summary.total_bookings}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Total Revenue</span>
                      <span className="font-semibold">{formatCurrency(bookingData.booking_summary.total_revenue)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Average Booking Value</span>
                      <span className="font-semibold">{formatCurrency(bookingData.booking_summary.average_booking_value)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="font-semibold">{bookingData.booking_summary.conversion_rate}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No booking data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="animate-pulse flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : bookingData ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <span className="text-sm font-medium">Approved</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {bookingData.status_distribution.approved}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <span className="text-sm font-medium">Pending</span>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        {bookingData.status_distribution.pending}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <span className="text-sm font-medium">Cancelled</span>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        {bookingData.status_distribution.cancelled}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20">
                      <span className="text-sm font-medium">Failed</span>
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                        {bookingData.status_distribution.failed}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No status data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Queries Tab */}
        <TabsContent value="queries" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  Query Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {queryLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="animate-pulse flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : queryData ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Total Queries</span>
                      <span className="font-semibold">{queryData.query_summary.total_queries}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Resolution Rate</span>
                      <span className="font-semibold">{queryData.query_summary.resolution_rate}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Avg Resolution Time</span>
                      <span className="font-semibold">{queryData.query_summary.average_resolution_time_hours}h</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Pending Queries</span>
                      <span className="font-semibold">{queryData.query_summary.pending_queries}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No query data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {queryLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="animate-pulse flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : queryData ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <span className="text-sm font-medium">Open</span>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {queryData.status_distribution.open}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <span className="text-sm font-medium">In Progress</span>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        {queryData.status_distribution["in-progress"]}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <span className="text-sm font-medium">Resolved</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {queryData.status_distribution.resolved}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20">
                      <span className="text-sm font-medium">Closed</span>
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                        {queryData.status_distribution.closed}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No status data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <PerformanceMetrics
            data={performanceData}
            isLoading={performanceLoading}
            error={performanceError}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default AnalyticsPage;