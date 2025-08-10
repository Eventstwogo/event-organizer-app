"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosinstance";
import useStore from "@/lib/Zustand";
 
// Types for dashboard statistics
export interface DashboardStat {
  count: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  percentage?: string;
}

export interface DashboardStats {
  events: DashboardStat;
  queries: DashboardStat;
  users: DashboardStat;
  revenue: DashboardStat;
}

// Types for API responses
interface EventStats {
  total_events: number;
  upcoming_events: number;
  past_events: number;
  active_events: number;
  event_categories: number;
}

interface QueryStats {
  total_queries: number;
  open_queries: number;
  resolved_queries: number;
  in_progress_queries: number;
  avg_response_time: number;
}

interface UserStats {
  total_users: number;
  active_users: number;
  new_users_this_month: number;
  user_growth_rate: number;
}

interface RevenueStats {
  total_revenue: number;
  monthly_revenue: number;
  tickets_sold: number;
  revenue_growth: number;
}

interface DashboardApiResponse {
  events: EventStats;
  queries: QueryStats;
  users: UserStats;
  revenue: RevenueStats;
}

// Hook for dashboard statistics
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useStore();
 
  const fetchStats = async () => {
    if (!userId) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
     
      // Fetch real dashboard data from multiple endpoints
      // COMMENTED OUT: Temporarily disabled analytics API calls
      // const [eventsResponse, queriesResponse, usersResponse, revenueResponse] = await Promise.allSettled([
      //   axiosInstance.get(`/organizers/analytics/events/${userId}`),
      //   axiosInstance.get(`/organizers/analytics/queries/${userId}`),
      //   axiosInstance.get(`/organizers/analytics/users/${userId}`),
      //   axiosInstance.get(`/organizers/analytics/revenue/${userId}`)
      // ]);

      // Mock responses to maintain functionality
      const eventsResponse = { status: 'rejected' as const };
      const queriesResponse = { status: 'rejected' as const };
      const usersResponse = { status: 'rejected' as const };
      const revenueResponse = { status: 'rejected' as const };

      // Process events data
      let eventsData: EventStats = { total_events: 0, upcoming_events: 0, past_events: 0, active_events: 0, event_categories: 0 };
      if (eventsResponse.status === 'fulfilled') {
        eventsData = eventsResponse.value.data.data || eventsData;
      }

      // Process queries data
      let queriesData: QueryStats = { total_queries: 0, open_queries: 0, resolved_queries: 0, in_progress_queries: 0, avg_response_time: 0 };
      if (queriesResponse.status === 'fulfilled') {
        queriesData = queriesResponse.value.data.data || queriesData;
      }

      // Process users data
      let usersData: UserStats = { total_users: 0, active_users: 0, new_users_this_month: 0, user_growth_rate: 0 };
      if (usersResponse.status === 'fulfilled') {
        usersData = usersResponse.value.data.data || usersData;
      }

      // Process revenue data
      let revenueData: RevenueStats = { total_revenue: 0, monthly_revenue: 0, tickets_sold: 0, revenue_growth: 0 };
      if (revenueResponse.status === 'fulfilled') {
        revenueData = revenueResponse.value.data.data || revenueData;
      }

      // Transform API data to dashboard stats format
      const dashboardStats: DashboardStats = {
        events: {
          count: eventsData.total_events.toString(),
          trend: `${eventsData.upcoming_events} upcoming events`,
          trendDirection: eventsData.upcoming_events > 0 ? 'up' : 'neutral',
          percentage: eventsData.active_events > 0 ? `${eventsData.active_events} active` : undefined
        },
        queries: {
          count: queriesData.total_queries.toString(),
          trend: `${queriesData.open_queries} open queries`,
          trendDirection: queriesData.open_queries > queriesData.resolved_queries ? 'up' : 
                         queriesData.resolved_queries > queriesData.open_queries ? 'down' : 'neutral',
          percentage: queriesData.avg_response_time > 0 ? `${queriesData.avg_response_time}h avg response` : undefined
        },
        users: {
          count: usersData.total_users.toString(),
          trend: `${usersData.new_users_this_month} new this month`,
          trendDirection: usersData.user_growth_rate > 0 ? 'up' : 
                         usersData.user_growth_rate < 0 ? 'down' : 'neutral',
          percentage: usersData.user_growth_rate !== 0 ? `${usersData.user_growth_rate > 0 ? '+' : ''}${usersData.user_growth_rate.toFixed(1)}%` : undefined
        },
        revenue: {
          count: `$${revenueData.total_revenue.toLocaleString()}`,
          trend: `${revenueData.tickets_sold} tickets sold`,
          trendDirection: revenueData.revenue_growth > 0 ? 'up' : 
                         revenueData.revenue_growth < 0 ? 'down' : 'neutral',
          percentage: revenueData.revenue_growth !== 0 ? `${revenueData.revenue_growth > 0 ? '+' : ''}${revenueData.revenue_growth.toFixed(1)}%` : undefined
        }
      };
     
      setStats(dashboardStats);
    } catch (err) {
      console.error('Dashboard stats fetch error:', err);
      
      // Fallback to basic data if API calls fail
      try {
        // Try to get basic organizer details as fallback
        const organizerResponse = await axiosInstance.get(`/organizers/${userId}`);
        const organizerData = organizerResponse.data.organizer_login;
        
        const fallbackStats: DashboardStats = {
          events: {
            count: "0",
            trend: "No events data available",
            trendDirection: 'neutral'
          },
          queries: {
            count: "0", 
            trend: "No queries data available",
            trendDirection: 'neutral'
          },
          users: {
            count: "1",
            trend: `Welcome ${organizerData?.username || 'User'}`,
            trendDirection: 'neutral'
          },
          revenue: {
            count: "$0",
            trend: "No revenue data available", 
            trendDirection: 'neutral'
          }
        };
        
        setStats(fallbackStats);
      } catch (fallbackErr) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [userId]);
 
  const refetch = () => {
    fetchStats();
  };

  // Format stats for display
  const formattedStats = stats ? [
    stats.events,
    stats.queries,
    stats.users,
    stats.revenue
  ] : [];

  return {
    stats,
    formattedStats,
    isLoading,
    error,
    refetch
  };
};

// Hook for theme animations
export const useThemeAnimations = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCardHoverClass = (bgGradient: string) => {
    return "hover:scale-[1.02] transition-all duration-300 ease-out";
  };

  const getIconAnimationClass = () => {
    return "group-hover:scale-110 transition-transform duration-300 ease-out";
  };

  const getButtonAnimationClass = () => {
    return "group-hover/btn:translate-x-1 transition-transform duration-200 ease-out";
  };

  return {
    mounted,
    getCardHoverClass,
    getIconAnimationClass,
    getButtonAnimationClass
  };
};