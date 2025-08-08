"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  CreditCard,
  Wallet,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { useDashboardOverview, AnalyticsPeriod } from "@/hooks/use-analytics";
import { PeriodSelector } from "@/components/analytics";

const RevenuePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>("30d");

  const { data: overviewData, isLoading, error } = useDashboardOverview(selectedPeriod);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTrendIcon = (current: number, previous: number = 0) => {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (current: number, previous: number = 0) => {
    if (current > previous) {
      return "text-green-600 dark:text-green-400";
    } else if (current < previous) {
      return "text-red-600 dark:text-red-400";
    }
    return "text-gray-600 dark:text-gray-400";
  };

  // Mock revenue breakdown data
  const revenueBreakdown = [
    {
      category: "Event Tickets",
      amount: 15420.50,
      percentage: 65,
      change: 12.5,
      color: "bg-blue-500",
    },
    {
      category: "Premium Services",
      amount: 5680.25,
      percentage: 24,
      change: -3.2,
      color: "bg-purple-500",
    },
    {
      category: "Merchandise",
      amount: 2150.75,
      percentage: 9,
      change: 8.7,
      color: "bg-green-500",
    },
    {
      category: "Sponsorships",
      amount: 475.00,
      percentage: 2,
      change: 15.3,
      color: "bg-orange-500",
    },
  ];

  // Mock recent transactions
  const recentTransactions = [
    {
      id: "TXN001",
      type: "Event Booking",
      customer: "John Doe",
      event: "Tech Conference 2024",
      amount: 299.99,
      status: "completed",
      date: "2024-01-15T10:30:00Z",
    },
    {
      id: "TXN002",
      type: "Premium Service",
      customer: "Jane Smith",
      event: "Marketing Workshop",
      amount: 149.99,
      status: "pending",
      date: "2024-01-14T15:45:00Z",
    },
    {
      id: "TXN003",
      type: "Event Booking",
      customer: "Bob Johnson",
      event: "Design Masterclass",
      amount: 199.99,
      status: "completed",
      date: "2024-01-13T09:15:00Z",
    },
    {
      id: "TXN004",
      type: "Merchandise",
      customer: "Alice Brown",
      event: "Startup Summit",
      amount: 49.99,
      status: "completed",
      date: "2024-01-12T14:20:00Z",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-500/25">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Revenue Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track and analyze your revenue streams
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <PeriodSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        dateRange={overviewData?.date_range}
      />

      {/* Revenue Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(overviewData?.revenue_statistics.total_revenue || 0)}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12.5% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <Wallet className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(overviewData?.revenue_statistics.pending_revenue || 0)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Awaiting processing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
            <CreditCard className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(overviewData?.revenue_statistics.average_booking_value || 0)}
            </div>
            <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
              <ArrowUpRight className="w-3 h-3" />
              <span>+5.2% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <BarChart3 className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18.7%</div>
            <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
              <ArrowUpRight className="w-3 h-3" />
              <span>Compared to last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex justify-between items-center mb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              revenueBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
                      <div className={`flex items-center gap-1 text-xs ${getTrendColor(item.change, 0)}`}>
                        {item.change > 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : item.change < 0 ? (
                          <ArrowDownRight className="w-3 h-3" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                        <span>{Math.abs(item.change)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-500" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border/50">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">{transaction.type}</h4>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{transaction.customer} • {transaction.event}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()} at {new Date(transaction.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Monthly Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Revenue Chart</h3>
              <p className="text-muted-foreground">
                Chart visualization will be implemented here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default RevenuePage;