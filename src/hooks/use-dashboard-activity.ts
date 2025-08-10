"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosinstance";
import useStore from "@/lib/Zustand";

// Types for activity and notifications
export interface ActivityItem {
  id: string;
  type: 'event' | 'query' | 'user' | 'ticket' | 'system';
  message: string;
  time: string;
  timestamp: string;
  metadata?: {
    event_id?: string;
    query_id?: string;
    user_id?: string;
  };
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface DashboardActivity {
  recentActivity: ActivityItem[];
  notifications: NotificationItem[];
  systemHealth: {
    status: 'online' | 'maintenance' | 'offline';
    uptime: string;
    lastUpdate: string;
  };
}

// Hook for dashboard activity data
export const useDashboardActivity = () => {
  const [activity, setActivity] = useState<DashboardActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useStore();

  const fetchActivity = async () => {
    if (!userId) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch activity data from multiple sources
      // COMMENTED OUT: Temporarily disabled activity and notifications API calls
      // const [activityResponse, notificationsResponse] = await Promise.allSettled([
      //   axiosInstance.get(`/organizers/activity/${userId}?limit=5`),
      //   axiosInstance.get(`/organizers/notifications/${userId}?limit=3`)
      // ]);

      // Mock responses to maintain functionality
      const activityResponse = { status: 'rejected' as const };
      const notificationsResponse = { status: 'rejected' as const };

      let recentActivity: ActivityItem[] = [];
      let notifications: NotificationItem[] = [];

      // Process activity data
      if (activityResponse.status === 'fulfilled') {
        const activityData = activityResponse.value.data.data || [];
        recentActivity = activityData.map((item: any) => ({
          id: item.id || Math.random().toString(),
          type: item.type || 'system',
          message: item.message || item.description || 'Activity recorded',
          time: formatTimeAgo(item.timestamp || item.created_at),
          timestamp: item.timestamp || item.created_at,
          metadata: item.metadata
        }));
      }

      // Process notifications data
      if (notificationsResponse.status === 'fulfilled') {
        const notificationData = notificationsResponse.value.data.data || [];
        notifications = notificationData.map((item: any) => ({
          id: item.id || Math.random().toString(),
          type: item.type || 'info',
          title: item.title || 'Notification',
          message: item.message || item.content || 'You have a new notification',
          timestamp: item.timestamp || item.created_at,
          read: item.read || false,
          priority: item.priority || 'medium'
        }));
      }

      // If no real data, create fallback activity based on existing queries
      if (recentActivity.length === 0) {
        try {
          const queriesResponse = await axiosInstance.get(`/organizers/queries/list?user_id=${userId}&limit=3`);
          const queries = queriesResponse.data.data?.queries || [];
          
          recentActivity = queries.map((query: any, index: number) => ({
            id: `query-${query.id || index}`,
            type: 'query' as const,
            message: `Query "${query.title || 'Untitled'}" ${query.query_status === 'open' ? 'received' : 'updated'}`,
            time: formatTimeAgo(query.updated_at || query.created_at),
            timestamp: query.updated_at || query.created_at,
            metadata: { query_id: query.id?.toString() }
          }));
        } catch (queryError) {
          // Fallback to generic activity
          recentActivity = [
            {
              id: '1',
              type: 'system',
              message: 'Dashboard loaded successfully',
              time: 'Just now',
              timestamp: new Date().toISOString()
            }
          ];
        }
      }

      // Default notifications if none exist
      if (notifications.length === 0) {
        notifications = [
          {
            id: '1',
            type: 'info',
            title: 'Welcome',
            message: 'Your event organizer dashboard is ready!',
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'low'
          }
        ];
      }

      const dashboardActivity: DashboardActivity = {
        recentActivity,
        notifications,
        systemHealth: {
          status: 'online',
          uptime: '99.9%',
          lastUpdate: new Date().toLocaleString()
        }
      };

      setActivity(dashboardActivity);
    } catch (err) {
      console.error('Dashboard activity fetch error:', err);
      
      // Fallback data
      const fallbackActivity: DashboardActivity = {
        recentActivity: [
          {
            id: '1',
            type: 'system',
            message: 'Dashboard initialized',
            time: 'Just now',
            timestamp: new Date().toISOString()
          }
        ],
        notifications: [
          {
            id: '1',
            type: 'info',
            title: 'System Status',
            message: 'All systems operational',
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'low'
          }
        ],
        systemHealth: {
          status: 'online',
          uptime: '99.9%',
          lastUpdate: new Date().toLocaleString()
        }
      };
      
      setActivity(fallbackActivity);
      setError(err instanceof Error ? err.message : 'Failed to fetch activity data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [userId]);

  const refetch = () => {
    fetchActivity();
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!activity) return;

    try {
      // COMMENTED OUT: Temporarily disabled notification read API call
      // await axiosInstance.patch(`/organizers/notifications/${notificationId}/read`);
      
      // Update state locally without API call
      setActivity(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          notifications: prev.notifications.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        };
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return {
    activity,
    isLoading,
    error,
    refetch,
    markNotificationAsRead
  };
};

// Helper function to format time ago
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return time.toLocaleDateString();
}