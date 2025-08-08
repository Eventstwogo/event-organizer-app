"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  MapPin,
  Users,
  Eye,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import { DashboardOverviewData } from "@/hooks/use-analytics";
import Link from "next/link";
import Image from "next/image";

interface RecentEventsProps {
  data: DashboardOverviewData | null;
  isLoading: boolean;
  error: string | null;
}

const RecentEvents: React.FC<RecentEventsProps> = ({ data, isLoading, error }) => {
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

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-border/50">
              <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.recent_events?.length) {
    return (
      <Card className="bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base font-semibold text-foreground">Recent Events</CardTitle>
          </div>
          <Link href="/Events">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Recent Events</h3>
            <p className="text-muted-foreground mb-4">
              {error ? "Failed to load recent events" : "You haven't created any events yet"}
            </p>
            <Link href="/Events/BasicInfo">
              <Button>Create Your First Event</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <CardTitle className="text-base font-semibold text-foreground">Recent Events</CardTitle>
        </div>
        <Link href="/Events">
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.recent_events.slice(0, 3).map((event) => (
          <div
            key={event.event_id}
            className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-border transition-colors duration-200 group"
          >
            <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              {event.card_image ? (
                <Image
                  src={event.card_image}
                  alt={event.event_title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate group-hover:text-blue-600 transition-colors duration-200">
                    {event.event_title}
                  </h4>
                  <Badge
                    variant="secondary"
                    className={`mt-1 text-xs ${getCategoryColor(event.category_name)}`}
                  >
                    {event.category_name}
                  </Badge>
                </div>
                <Badge
                  variant={event.event_status ? "default" : "secondary"}
                  className="ml-2 flex-shrink-0"
                >
                  {event.event_status ? "Active" : "Draft"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {data.recent_events.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Recent Events</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any events yet
            </p>
            <Link href="/Events/BasicInfo">
              <Button>Create Your First Event</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentEvents;