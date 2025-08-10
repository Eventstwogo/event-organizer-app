"use client";
 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
 
// API Response interfaces for summary
interface ApiBookingSummary {
  booking_id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  currency: string;
  booking_status: 'confirmed' | 'pending' | 'cancelled' | 'refunded';
  payment_status?: 'paid' | 'pending' | 'failed' | 'refunded';
  created_at: string;
  updated_at?: string;
  tickets_count: number;
}
 
interface ApiEventSummary {
  event_id: string;
  title: string;
  slug: string;
  card_image: string;
  start_date: string;
  end_date: string;
  status: string;
  slots_count: number;
}
 
interface ApiSlotSummary {
  slot_id: string;
  slot_time: string;
  total_capacity: number;
  booked_seats: number;
  remaining_seats: number;
  user_bookings_count: number;
  bookings: ApiBookingSummary[];
}
 
interface ApiEventWithSlotsSummary {
  event: ApiEventSummary;
  slots: ApiSlotSummary[];
}
 
interface ApiResponseSummary {
  statusCode: number;
  message: string;
  timestamp: string;
  method: string;
  path: string;
  data: {
    events_count: {
      total: number;
      active: number;
      inactive: number;
    };
    events: ApiEventWithSlotsSummary[];
    total_items: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}
 
// Booking interfaces (simplified for summary)
interface BookingSummaryData {
  totalBookings: number;
  totalRevenue: number;
  confirmedBookings: number;
  pendingBookings: number;
  recentBookings: {
    booking_id: string;
    booking_reference: string;
    customer_name: string;
    event_title: string;
    total_amount: number;
    currency: string;
    booking_status: string;
    created_at: string;
  }[];
}
 
interface BookingSummaryProps {
  data?: BookingSummaryData;
  apiData?: ApiResponseSummary;
  loading?: boolean;
}
 
// Transform API data to summary format
const transformApiDataToSummary = (apiData: ApiResponseSummary): BookingSummaryData => {
  const allBookings: (ApiBookingSummary & { event_title: string })[] = [];
 
  // Extract all bookings from all events and slots
  apiData.data.events.forEach((eventWithSlots) => {
    const { event, slots } = eventWithSlots;
   
    slots.forEach((slot) => {
      slot.bookings.forEach((booking) => {
        allBookings.push({
          ...booking,
          event_title: event.title
        });
      });
    });
  });
 
  // Calculate summary statistics
  const totalBookings = allBookings.length;
  const confirmedBookings = allBookings.filter(b => b.booking_status === 'confirmed').length;
  const pendingBookings = allBookings.filter(b => b.booking_status === 'pending').length;
 
  // Calculate total revenue (only from paid bookings)
  const totalRevenue = allBookings
    .filter(b => b.payment_status === 'paid' || b.booking_status === 'confirmed')
    .reduce((sum, b) => sum + b.total_amount, 0);
 
  // Get recent bookings (last 5, sorted by created_at)
  const recentBookings = allBookings
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map(booking => ({
      booking_id: booking.booking_id,
      booking_reference: booking.booking_reference,
      customer_name: booking.customer_name,
      event_title: booking.event_title,
      total_amount: booking.total_amount,
      currency: booking.currency,
      booking_status: booking.booking_status,
      created_at: booking.created_at
    }));
 
  return {
    totalBookings,
    totalRevenue,
    confirmedBookings,
    pendingBookings,
    recentBookings
  };
};
 
// Mock data for demonstration
const mockSummaryData: BookingSummaryData = {
  totalBookings: 45,
  totalRevenue: 12450.75,
  confirmedBookings: 38,
  pendingBookings: 7,
  recentBookings: [
    {
      booking_id: "1",
      booking_reference: "BK001",
      customer_name: "John Doe",
      event_title: "Tech Conference 2024",
      total_amount: 199.98,
      currency: "USD",
      booking_status: "confirmed",
      created_at: "2024-02-15T10:30:00Z"
    },
    {
      booking_id: "2",
      booking_reference: "BK002",
      customer_name: "Jane Smith",
      event_title: "Music Festival",
      total_amount: 299.99,
      currency: "USD",
      booking_status: "pending",
      created_at: "2024-02-20T14:15:00Z"
    },
    {
      booking_id: "3",
      booking_reference: "BK003",
      customer_name: "Mike Johnson",
      event_title: "Art Exhibition",
      total_amount: 100.00,
      currency: "USD",
      booking_status: "confirmed",
      created_at: "2024-02-25T09:45:00Z"
    }
  ]
};
 
const BookingSummary: React.FC<BookingSummaryProps> = ({
  data,
  apiData,
  loading = false
}) => {
  // Use API data if available, otherwise fall back to provided data or mock data
  const summaryData = apiData ? transformApiDataToSummary(apiData) : (data || mockSummaryData);
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
 
        {/* Recent Bookings Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
 
  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800"
  };
 
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryData.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryData.confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">
              {summaryData.totalBookings > 0 ? ((summaryData.confirmedBookings / summaryData.totalBookings) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summaryData.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              {summaryData.totalBookings > 0 ? ((summaryData.pendingBookings / summaryData.totalBookings) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>
 
      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Link href="/bookings">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summaryData.recentBookings.map((booking) => (
              <div key={booking.booking_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {booking.customer_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {booking.customer_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.event_title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={statusColors[booking.booking_status as keyof typeof statusColors]}
                  >
                    {booking.booking_status}
                  </Badge>
                  <div className="text-sm font-medium">
                    {booking.currency} {booking.total_amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
         
          {summaryData.recentBookings.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent bookings</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
 
export default BookingSummary;