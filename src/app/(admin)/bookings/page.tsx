"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useBookings } from "@/hooks/use-bookings";

import useStore from "@/lib/Zustand";
import { toast } from "sonner";
import { 
  Calendar, 
  RefreshCw, 
  Search, 
  Users, 
  DollarSign,
  Clock,
  MapPin,
  Mail,
  Phone,
  Filter,
  Download,
  Eye
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

// API Response interfaces
interface ApiEvent {
  event_id: string;
  title: string;
  slug: string;
  card_image: string;
  start_date: string;
  end_date: string;
  status: string;
  slots_count: number;
}

interface ApiSlot {
  slot_id: string;
  slot_time: string;
  total_capacity: number;
  booked_seats: number;
  remaining_seats: number;
  user_bookings_count: number;
  bookings: ApiBooking[];
}

interface ApiBooking {
  booking_id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  currency: string;
  booking_status: 'confirmed' | 'pending' | 'cancelled' | 'refunded';
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  tickets_count: number;
}

interface ApiEventWithSlots {
  event: ApiEvent;
  slots: ApiSlot[];
}

interface ApiResponse {
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
    events: ApiEventWithSlots[];
    total_items: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

// Transformed interfaces for UI
interface BookingCustomer {
  customer_id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface BookingEvent {
  event_id: string;
  event_title: string;
  event_slug: string;
  card_image?: string;
  event_date: string;
  event_time: string;
  location?: string;
}

interface BookingTicket {
  ticket_id: string;
  ticket_type: string;
  price: number;
  quantity: number;
}

export interface Booking {
  booking_id: string;
  booking_reference: string;
  customer: BookingCustomer;
  event: BookingEvent;
  tickets: BookingTicket[];
  total_amount: number;
  currency: string;
  booking_status: 'confirmed' | 'pending' | 'cancelled' | 'refunded';
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  booking_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  slot_time?: string;
}

// Transform API data to UI format
const transformApiDataToBookings = (apiData: ApiResponse): Booking[] => {
  const bookings: Booking[] = [];
  
  apiData.data.events.forEach((eventWithSlots) => {
    const { event, slots } = eventWithSlots;
    
    slots.forEach((slot) => {
      slot.bookings.forEach((apiBooking) => {
        const transformedBooking: Booking = {
          booking_id: apiBooking.booking_id,
          booking_reference: apiBooking.booking_reference,
          customer: {
            customer_id: `customer_${apiBooking.booking_id}`,
            name: apiBooking.customer_name,
            email: apiBooking.customer_email,
            phone: apiBooking.customer_phone,
            avatar: ""
          },
          event: {
            event_id: event.event_id,
            event_title: event.title,
            event_slug: event.slug,
            card_image: event.card_image,
            event_date: event.start_date,
            event_time: slot.slot_time.split(' - ')[0], // Take start time
            location: ""
          },
          tickets: [
            {
              ticket_id: `ticket_${apiBooking.booking_id}`,
              ticket_type: "General Admission",
              price: apiBooking.total_amount / (apiBooking.tickets_count || 1),
              quantity: apiBooking.tickets_count || 1
            }
          ],
          total_amount: apiBooking.total_amount,
          currency: apiBooking.currency,
          booking_status: apiBooking.booking_status,
          payment_status: apiBooking.payment_status || 'pending',
          booking_date: apiBooking.created_at,
          created_at: apiBooking.created_at,
          updated_at: apiBooking.updated_at || apiBooking.created_at,
          slot_time: slot.slot_time
        };
        
        bookings.push(transformedBooking);
      });
    });
  });
  
  return bookings;
};

const BookingsPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useStore();
  const { bookings, loading, error, refetch } = useBookings();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");



  // Get unique events for filter
  const uniqueEvents = useMemo(() => {
    const events = bookings.map(booking => booking.event);
    return events.filter((event, index, self) => 
      index === self.findIndex(e => e.event_id === event.event_id)
    );
  }, [bookings]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.event.event_title.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || booking.booking_status === statusFilter;

      // Payment filter
      const matchesPayment = paymentFilter === "all" || booking.payment_status === paymentFilter;

      // Event filter
      const matchesEvent = eventFilter === "all" || booking.event.event_id === eventFilter;

      return matchesSearch && matchesStatus && matchesPayment && matchesEvent;
    });
  }, [bookings, searchTerm, statusFilter, paymentFilter, eventFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalBookings = filteredBookings.length;
    const totalRevenue = filteredBookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => sum + b.total_amount, 0);
    const confirmedBookings = filteredBookings.filter(b => b.booking_status === 'confirmed').length;
    const pendingBookings = filteredBookings.filter(b => b.booking_status === 'pending').length;

    return { totalBookings, totalRevenue, confirmedBookings, pendingBookings };
  }, [filteredBookings]);

  // Table columns
  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "booking_reference",
      header: "Booking Ref",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <button
            onClick={() => router.push(`/bookings/${booking.booking_id}`)}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {booking.booking_reference}
          </button>
        );
      },
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={booking.customer.avatar} />
              <AvatarFallback>
                {booking.customer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{booking.customer.name}</div>
              <div className="text-sm text-gray-500">{booking.customer.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "event",
      header: "Event",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium line-clamp-1">{booking.event.event_title}</div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(booking.event.event_date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {booking.slot_time || booking.event.event_time}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tickets",
      header: "Tickets",
      cell: ({ row }) => {
        const booking = row.original;
        const totalTickets = booking.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
        return (
          <div className="space-y-1">
            <div className="font-medium">{totalTickets} tickets</div>
            {booking.tickets.map((ticket, index) => (
              <div key={index} className="text-sm text-gray-500">
                {ticket.quantity}x {ticket.ticket_type}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="font-medium">
            {booking.currency} {booking.total_amount.toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "booking_status",
      header: "Status",
      cell: ({ row }) => {
        const booking = row.original;
        const statusColors = {
          confirmed: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          cancelled: "bg-red-100 text-red-800",
          refunded: "bg-gray-100 text-gray-800"
        };
        return (
          <Badge className={statusColors[booking.booking_status]}>
            {booking.booking_status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment",
      cell: ({ row }) => {
        const booking = row.original;
        const paymentColors = {
          paid: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          failed: "bg-red-100 text-red-800",
          refunded: "bg-gray-100 text-gray-800"
        };
        return (
          <Badge className={paymentColors[booking.payment_status]}>
            {booking.payment_status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Booked On",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="text-sm text-gray-600">
            {new Date(booking.created_at).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/bookings/${booking.booking_id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
              Bookings Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              View and manage all event bookings
            </p>
            {!loading && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {filteredBookings.length} of {bookings.length} bookings
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              onClick={refetch}
              variant="outline"
              className="h-10 sm:h-11 px-3 sm:px-4 text-sm w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {loading ? "Loading..." : "Refresh"}
            </Button>
            <Button
              variant="outline"
              className="h-10 sm:h-11 px-3 sm:px-4 text-sm w-full sm:w-auto"
              onClick={() => {
                // TODO: Implement export functionality
                toast.info("Export functionality coming soon!");
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-4 sm:mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search bookings, customers, events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Booking Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Filter */}
              <div>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Event Filter */}
              <div>
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {uniqueEvents.map((event) => (
                      <SelectItem key={event.event_id} value={event.event_id}>
                        {event.event_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        {loading ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="space-y-3 sm:space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3 sm:space-x-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-full max-w-[200px]"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 rounded animate-pulse w-full max-w-[150px]"></div>
                    </div>
                    <div className="hidden sm:block h-8 w-16 sm:w-20 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : filteredBookings.length === 0 && bookings.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No Bookings Found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-2">
                You don't have any bookings yet. Bookings will appear here once customers start booking your events.
              </p>
            </CardContent>
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 text-center">
              <Filter className="h-12 w-12 sm:h-14 sm:w-14 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No Bookings Match Your Filters
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 px-2">
                Try adjusting your search terms or filters.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPaymentFilter("all");
                  setEventFilter("all");
                }}
                variant="outline"
                className="h-10 text-sm"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0 sm:p-3 lg:p-6">
              <div className="overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={filteredBookings}
                  searchKey="booking_reference"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;