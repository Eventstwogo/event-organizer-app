"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useBookingAnalytics, AnalyticsPeriod } from "@/hooks/use-analytics";

const BookingsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: bookingData, isLoading, error } = useBookingAnalytics(selectedPeriod);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "failed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  // Mock booking data for demonstration
  const mockBookings = [
    {
      id: "BK001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+1234567890",
      eventTitle: "Tech Conference 2024",
      bookingDate: "2024-01-15",
      eventDate: "2024-02-20",
      amount: 299.99,
      status: "approved",
      ticketCount: 2,
    },
    {
      id: "BK002",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerPhone: "+1234567891",
      eventTitle: "Marketing Workshop",
      bookingDate: "2024-01-14",
      eventDate: "2024-02-18",
      amount: 149.99,
      status: "pending",
      ticketCount: 1,
    },
    {
      id: "BK003",
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
      customerPhone: "+1234567892",
      eventTitle: "Design Masterclass",
      bookingDate: "2024-01-13",
      eventDate: "2024-02-15",
      amount: 199.99,
      status: "cancelled",
      ticketCount: 1,
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Bookings Management
            </h1>
            <p className="text-muted-foreground">
              Manage and track all event bookings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingData?.booking_summary.total_bookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time bookings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingData?.status_distribution.approved || 0}</div>
            <p className="text-xs text-muted-foreground">
              Confirmed bookings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingData?.status_distribution.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
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
              {formatCurrency(bookingData?.booking_summary.total_revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              From all bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search bookings by customer name, email, or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border border-border/50 rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : mockBookings.length > 0 ? (
            <div className="space-y-4">
              {mockBookings
                .filter(booking => 
                  statusFilter === "all" || booking.status === statusFilter
                )
                .filter(booking =>
                  searchTerm === "" ||
                  booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  booking.id.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4 p-4 border border-border/50 rounded-lg hover:border-border transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{booking.customerName}</h4>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{booking.eventTitle}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {booking.customerEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {booking.customerPhone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {formatCurrency(booking.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.ticketCount} ticket{booking.ticketCount > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Bookings Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "No bookings match your current filters" 
                  : "You haven't received any bookings yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default BookingsPage;