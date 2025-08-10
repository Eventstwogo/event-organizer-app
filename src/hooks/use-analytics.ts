"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosinstance";

// Types for the new analytics API responses
export interface DashboardOverviewData {
  period: string;
  date_range: {
    start_date: string;
    end_date: string;
  };
  event_statistics: {
    total_events: number;
    active_events: number;
    upcoming_events: number;
    past_events: number;
  };
  booking_statistics: {
    total_bookings: number;
    approved_bookings: number;
    pending_bookings: number;
    cancelled_bookings: number;
    approval_rate: number;
  };
  revenue_statistics: {
    total_revenue: number;
    pending_revenue: number;
    average_booking_value: number;
  };
  query_statistics: {
    total_queries: number;
    pending_queries: number;
    resolved_queries: number;
    resolution_rate: number;
  };
  recent_events: Array<{
    event_id: string;
    event_title: string;
    category_name: string;
    start_date: string;
    event_status: boolean;
    created_at: string;
    card_image: string;
  }>;
}

export interface EventAnalyticsData {
  period: string;
  date_range: {
    start_date: string;
    end_date: string;
  };
  event_performance: Array<{
    event_id: string;
    event_title: string;
    category_name: string;
    start_date: string;
    end_date: string;
    total_bookings: number;
    total_revenue: number;
    event_status: boolean;
    is_online: boolean;
    card_image: string;
  }>;
  popular_categories: Array<{
    category_name: string;
    event_count: number;
    total_bookings: number;
    total_revenue: number;
  }>;
  booking_trends: any[];
  success_metrics: {
    total_events: number;
    events_with_bookings: number;
    success_rate: number;
    average_bookings_per_event: number;
  };
}

export interface BookingAnalyticsData {
  period: string;
  date_range: {
    start_date: string;
    end_date: string;
  };
  booking_summary: {
    total_bookings: number;
    total_revenue: number;
    pending_revenue: number;
    average_booking_value: number;
    conversion_rate: number;
  };
  status_distribution: {
    approved: number;
    pending: number;
    cancelled: number;
    failed: number;
  };
  booking_trends: any[];
  top_customers: any[];
  recent_bookings: any[];
}

export interface QueryAnalyticsData {
  period: string;
  date_range: {
    start_date: string;
    end_date: string;
  };
  query_summary: {
    total_queries: number;
    resolution_rate: number;
    average_resolution_time_hours: number;
    pending_queries: number;
  };
  status_distribution: {
    open: number;
    "in-progress": number;
    resolved: number;
    closed: number;
  };
  query_trends: any[];
  recent_queries: any[];
}

export interface PerformanceMetricsData {
  current_period: {
    month: string;
    events: number;
    bookings: number;
    revenue: number;
  };
  previous_period: {
    month: string;
    events: number;
    bookings: number;
    revenue: number;
  };
  growth_rates: {
    events_growth: number;
    bookings_growth: number;
    revenue_growth: number;
  };
  overall_statistics: {
    total_events: number;
    total_bookings: number;
    total_revenue: number;
  };
  key_performance_indicators: {
    average_bookings_per_event: number;
    average_revenue_per_event: number;
    average_revenue_per_booking: number;
  };
}

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "1y";

// Hook for dashboard overview analytics
export const useDashboardOverview = (period: AnalyticsPeriod = "30d") => {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(
        `/organizers/new-analytics/dashboard-overview?period=${period}`
      );
      
      if (response.data.statusCode === 200) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch dashboard overview");
      }
    } catch (err) {
      console.error("Dashboard overview fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard overview");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};

// Hook for event analytics
export const useEventAnalytics = (period: AnalyticsPeriod = "30d") => {
  const [data, setData] = useState<EventAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(
        `/organizers/new-analytics/event-analytics?period=${period}`
      );
      
      if (response.data.statusCode === 200) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch event analytics");
      }
    } catch (err) {
      console.error("Event analytics fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch event analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};

// Hook for booking analytics
export const useBookingAnalytics = (period: AnalyticsPeriod = "30d") => {
  const [data, setData] = useState<BookingAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(
        `/organizers/new-analytics/booking-analytics?period=${period}`
      );
      
      if (response.data.statusCode === 200) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch booking analytics");
      }
    } catch (err) {
      console.error("Booking analytics fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch booking analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};

// Hook for query analytics
export const useQueryAnalytics = (period: AnalyticsPeriod = "30d") => {
  const [data, setData] = useState<QueryAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(
        `/organizers/new-analytics/query-analytics?period=${period}`
      );
      
      if (response.data.statusCode === 200) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch query analytics");
      }
    } catch (err) {
      console.error("Query analytics fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch query analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};

// Hook for performance metrics
export const usePerformanceMetrics = () => {
  const [data, setData] = useState<PerformanceMetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(
        `/organizers/new-analytics/performance-metrics`
      );
      
      if (response.data.statusCode === 200) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch performance metrics");
      }
    } catch (err) {
      console.error("Performance metrics fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch performance metrics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};