"use client";
 
import { useState, useEffect } from "react";
 
// Types for dashboard statistics
export interface DashboardStat {
  count: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  percentage?: string;
}
 
export interface DashboardStats {
  categories: DashboardStat;
  users: DashboardStat;
  revenue: DashboardStat;
  settings: DashboardStat;
}
 
// Hook for dashboard statistics
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
     
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      // Mock data - replace with actual API response
      const mockStats: DashboardStats = {
        categories: {
          count: "12",
          trend: "2 new this week",
          trendDirection: 'up',
          percentage: "+16.7%"
        },
        users: {
          count: "1,234",
          trend: "45 new this month",
          trendDirection: 'up',
          percentage: "+3.8%"
        },
        revenue: {
          count: "$12,345",
          trend: "Last 30 days",
          trendDirection: 'up',
          percentage: "+12.5%"
        },
        settings: {
          count: "8",
          trend: "System configurations",
          trendDirection: 'neutral'
        }
      };
     
      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };
 
  useEffect(() => {
    fetchStats();
  }, []);
 
  const refetch = () => {
    fetchStats();
  };
 
  // Format stats for display
  const formattedStats = stats ? [
    stats.categories,
    stats.users,
    stats.revenue,
    stats.settings
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