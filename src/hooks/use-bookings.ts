"use client";
 
import { useState, useCallback, useEffect } from "react";
import axiosInstance from "@/lib/axiosinstance";
import useStore from "@/lib/Zustand";
import { toast } from "sonner";
 
// API Response interfaces - Updated to match actual API response
interface ApiBooking {
  booking_id: number;
  event_title: string;
  event_id: string;
  user_name: string;
  user_email: string;
  slot_time: string;
  booking_date: string;
  num_seats: number;
  total_price: number;
  booking_status: 'approved' | 'processing' | 'cancelled' | 'refunded';
  payment_status: 'COMPLETED' | 'PENDING' | 'FAILED' | null;
  created_at: string;
}

export interface ApiBookingsResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  method: string;
  path: string;
  data: {
    bookings: ApiBooking[];
    total_items: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}
 
// Transformed booking interface
export interface TransformedBooking {
  booking_id: string;
  booking_reference: string;
  customer: {
    customer_id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  event: {
    event_id: string;
    event_title: string;
    event_slug: string;
    card_image?: string;
    event_date: string;
    event_time: string;
    location?: string;
  };
  tickets: {
    ticket_id: string;
    ticket_type: string;
    price: number;
    quantity: number;
  }[];
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
const transformApiDataToBookings = (apiData: ApiBookingsResponse): TransformedBooking[] => {
  const bookings: TransformedBooking[] = [];

  apiData.data.bookings.forEach((apiBooking) => {
    // Map booking status from API to UI format
    const mapBookingStatus = (status: string): 'confirmed' | 'pending' | 'cancelled' | 'refunded' => {
      switch (status.toLowerCase()) {
        case 'approved':
          return 'confirmed';
        case 'processing':
          return 'pending';
        case 'cancelled':
          return 'cancelled';
        case 'refunded':
          return 'refunded';
        default:
          return 'pending';
      }
    };

    // Map payment status from API to UI format
    const mapPaymentStatus = (status: string | null): 'paid' | 'pending' | 'failed' | 'refunded' => {
      if (!status) return 'pending';
      switch (status.toUpperCase()) {
        case 'COMPLETED':
          return 'paid';
        case 'PENDING':
          return 'pending';
        case 'FAILED':
          return 'failed';
        case 'REFUNDED':
          return 'refunded';
        default:
          return 'pending';
      }
    };

    const transformedBooking: TransformedBooking = {
      booking_id: apiBooking.booking_id.toString(),
      booking_reference: `BK-${apiBooking.booking_id}`,
      customer: {
        customer_id: `customer_${apiBooking.booking_id}`,
        name: apiBooking.user_name,
        email: apiBooking.user_email,
        phone: undefined,
        avatar: ""
      },
      event: {
        event_id: apiBooking.event_id,
        event_title: apiBooking.event_title,
        event_slug: apiBooking.event_id, // Using event_id as slug since slug is not provided
        card_image: "", // Default empty string since card_image is not provided in API
        event_date: apiBooking.booking_date,
        event_time: apiBooking.slot_time.split(' - ')[0], // Take start time
        location: ""
      },
      tickets: [
        {
          ticket_id: `ticket_${apiBooking.booking_id}`,
          ticket_type: "",
          price: apiBooking.total_price / apiBooking.num_seats,
          quantity: apiBooking.num_seats
        }
      ],
      total_amount: apiBooking.total_price,
      currency: "AUD", // Default currency since not provided in API
      booking_status: mapBookingStatus(apiBooking.booking_status),
      payment_status: mapPaymentStatus(apiBooking.payment_status),
      booking_date: apiBooking.booking_date,
      created_at: apiBooking.created_at,
      updated_at: apiBooking.created_at, // Using created_at since updated_at is not provided
      slot_time: apiBooking.slot_time
    };
   
    bookings.push(transformedBooking);
  });

  return bookings;
};
 
export const useBookings = () => {
  const { userId } = useStore();
  const [bookings, setBookings] = useState<TransformedBooking[]>([]);
  const [rawApiData, setRawApiData] = useState<ApiBookingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const fetchBookings = useCallback(async (showToast: boolean = true) => {
    if (!userId) {
      console.warn("User ID not available yet. Skipping fetch.");
      return;
    }
 
    try {
      setLoading(true);
      setError(null);
     
      // Call the actual API endpoint
      const response = await axiosInstance.get(`/bookings/organizer/${userId}`);
     
      if (response.data && response.data.statusCode === 200) {
        console.log("Raw API Response:", response.data);
        const transformedBookings = transformApiDataToBookings(response.data);
        console.log("Transformed Bookings:", transformedBookings);
        setBookings(transformedBookings);
        setRawApiData(response.data);
       
        if (showToast) {
          toast.success(`Loaded ${transformedBookings.length} bookings successfully!`);
        }
      } else {
        console.warn("Unexpected API response format:", response.data);
        setBookings([]);
        setRawApiData(null);
       
        if (showToast) {
          toast.warning("No bookings found or unexpected response format.");
        }
      }
     
      setLoading(false);
 
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      setError(error.message || "Failed to fetch bookings");
     
      // Handle different error scenarios
      if (error.response?.status === 404) {
        if (showToast) {
          toast.info("No bookings found for this organizer.");
        }
        setBookings([]);
        setRawApiData(null);
      } else if (error.response?.status === 401) {
        if (showToast) {
          toast.error("Authentication failed. Please login again.");
        }
        setBookings([]);
        setRawApiData(null);
      } else {
        if (showToast) {
          toast.error("Failed to fetch bookings. Please try again.");
        }
        setBookings([]);
        setRawApiData(null);
      }
     
      setLoading(false);
    }
  }, [userId]);
 
  // Auto-fetch when userId becomes available
  useEffect(() => {
    if (userId) {
      fetchBookings(false); // Don't show toast on initial load
    }
  }, [userId, fetchBookings]);
 
  return {
    bookings,
    rawApiData,
    loading,
    error,
    fetchBookings,
    refetch: () => fetchBookings(true)
  };
};