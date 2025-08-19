// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";

// import axiosInstance from "@/lib/axiosinstance";
// import useStore from "@/lib/Zustand";
// import { toast } from "sonner";
// import { 
//   ArrowLeft,
//   Calendar,
//   Clock,
//   MapPin,
//   Mail,
//   Phone,
//   User,
//   CreditCard,
//   Ticket,
//   Download,
//   RefreshCw
// } from "lucide-react";

// // Import the Booking interface from the main bookings page
// interface BookingCustomer {
//   customer_id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   avatar?: string;
// }

// interface BookingEvent {
//   event_id: string;
//   event_title: string;
//   event_slug: string;
//   card_image?: string;
//   event_date: string;
//   event_time: string;
//   location?: string;
// }

// interface BookingTicket {
//   ticket_id: string;
//   ticket_type: string;
//   price: number;
//   quantity: number;
// }

// interface Booking {
//   booking_id: string;
//   booking_reference: string;
//   customer: BookingCustomer;
//   event: BookingEvent;
//   tickets: BookingTicket[];
//   total_amount: number;
//   currency: string;
//   booking_status: 'confirmed' | 'pending' | 'cancelled' | 'refunded';
//   payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
//   booking_date: string;
//   notes?: string;
//   created_at: string;
//   updated_at: string;
// }

// // Mock booking data - replace with actual API call
// const mockBooking: Booking = {
//   booking_id: "1",
//   booking_reference: "BK001",
//   customer: {
//     customer_id: "c1",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     phone: "+1234567890",
//     avatar: ""
//   },
//   event: {
//     event_id: "e1",
//     event_title: "Tech Conference 2024",
//     event_slug: "tech-conference-2024",
//     card_image: "",
//     event_date: "2024-03-15",
//     event_time: "09:00",
//     location: "Convention Center, NYC"
//   },
//   tickets: [
//     {
//       ticket_id: "t1",
//       ticket_type: "",
//       price: 99.99,
//       quantity: 2
//     }
//   ],
//   total_amount: 199.98,
//   currency: "AUD",
//   booking_status: "confirmed",
//   payment_status: "paid",
//   booking_date: "2024-03-15T09:00:00Z",
//   notes: "Customer requested front row seating if available.",
//   created_at: "2024-02-15T10:30:00Z",
//   updated_at: "2024-02-15T10:30:00Z"
// };

// const BookingDetailsPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const { userId } = useStore();
//   const [booking, setBooking] = useState<Booking | null>(null);
//   const [loading, setLoading] = useState(true);

//   const bookingId = params.bookingId as string;

//   // Fetch booking details
//   const fetchBookingDetails = async () => {
//     if (!bookingId || !userId) return;

//     try {
//       setLoading(true);
      
//       // TODO: Replace with actual API endpoint
//       // const response = await axiosInstance.get(`/bookings/${bookingId}`);
      
//       // For now, using mock data
//       setTimeout(() => {
//         setBooking(mockBooking);
//         setLoading(false);
//       }, 1000);

//     } catch (error: any) {
//       console.error("Error fetching booking details:", error);
//       toast.error("Failed to fetch booking details. Please try again.");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookingDetails();
//   }, [bookingId, userId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//         <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
//           <div className="space-y-6">
//             {/* Header Skeleton */}
//             <div className="flex items-center gap-4">
//               <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
//               <div className="space-y-2">
//                 <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
//               </div>
//             </div>
            
//             {/* Content Skeleton */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 space-y-6">
//                 <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
//                 <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
//               </div>
//               <div className="space-y-6">
//                 <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
//                 <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!booking) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//         <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
//           <div className="text-center py-12">
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
//             <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
//             <Button onClick={() => router.push('/bookings')}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Bookings
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const statusColors = {
//     confirmed: "bg-green-100 text-green-800",
//     pending: "bg-yellow-100 text-yellow-800",
//     cancelled: "bg-red-100 text-red-800",
//     refunded: "bg-gray-100 text-gray-800"
//   };

//   const paymentColors = {
//     paid: "bg-green-100 text-green-800",
//     pending: "bg-yellow-100 text-yellow-800",
//     failed: "bg-red-100 text-red-800",
//     refunded: "bg-gray-100 text-gray-800"
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => router.push('/bookings')}
//               className="h-10 w-10 p-0"
//             >
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
//                 Booking Details
//               </h1>
//               <p className="text-sm text-gray-600">
//                 Reference: {booking.booking_reference}
//               </p>
//             </div>
//           </div>
          
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={fetchBookingDetails}
//               disabled={loading}
//             >
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Refresh
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 // TODO: Implement download functionality
//                 toast.info("Download functionality coming soon!");
//               }}
//             >
//               <Download className="h-4 w-4 mr-2" />
//               Download
//             </Button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Event Details */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Calendar className="h-5 w-5" />
//                   Event Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {booking.event.event_title}
//                   </h3>
//                 </div>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Calendar className="h-4 w-4" />
//                     <span>{new Date(booking.event.event_date).toLocaleDateString()}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Clock className="h-4 w-4" />
//                     <span>{booking.event.event_time}</span>
//                   </div>
//                   {booking.event.location && (
//                     <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
//                       <MapPin className="h-4 w-4" />
//                       <span>{booking.event.location}</span>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Ticket Details */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Ticket className="h-5 w-5" />
//                   Ticket Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {booking.tickets.map((ticket, index) => (
//                     <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
//                       <div>
//                         <h4 className="font-medium">{ticket.ticket_type}</h4>
//                         <p className="text-sm text-gray-600">Quantity: {ticket.quantity}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-medium">
//                           {booking.currency} {ticket.price.toFixed(2)} each
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Total: {booking.currency} {(ticket.price * ticket.quantity).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
                  
//                   <Separator />
                  
//                   <div className="flex justify-between items-center text-lg font-semibold">
//                     <span>Total Amount:</span>
//                     <span>{booking.currency} {booking.total_amount.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Notes */}
//             {booking.notes && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Notes</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-700">{booking.notes}</p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Status */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Status</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Booking Status</label>
//                   <div className="mt-1">
//                     <Badge className={statusColors[booking.booking_status]}>
//                       {booking.booking_status}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Payment Status</label>
//                   <div className="mt-1">
//                     <Badge className={paymentColors[booking.payment_status]}>
//                       {booking.payment_status}
//                     </Badge>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Customer Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <User className="h-5 w-5" />
//                   Customer Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <Avatar className="h-12 w-12">
//                     <AvatarImage src={booking.customer.avatar} />
//                     <AvatarFallback>
//                       {booking.customer.name.split(' ').map(n => n[0]).join('')}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <h4 className="font-medium">{booking.customer.name}</h4>
//                     <p className="text-sm text-gray-600">ID: {booking.customer.customer_id}</p>
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Mail className="h-4 w-4" />
//                     <span className="text-sm">{booking.customer.email}</span>
//                   </div>
//                   {booking.customer.phone && (
//                     <div className="flex items-center gap-2 text-gray-600">
//                       <Phone className="h-4 w-4" />
//                       <span className="text-sm">{booking.customer.phone}</span>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Booking Timeline */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Timeline</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Booked On</label>
//                   <p className="text-sm">{new Date(booking.created_at).toLocaleString()}</p>
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Last Updated</label>
//                   <p className="text-sm">{new Date(booking.updated_at).toLocaleString()}</p>
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Event Date</label>
//                   <p className="text-sm">{new Date(booking.booking_date).toLocaleString()}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingDetailsPage;




"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import axiosInstance from "@/lib/axiosinstance";
import useStore from "@/lib/Zustand";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  User,
  CreditCard,
  Ticket,
  Download,
  RefreshCw
} from "lucide-react";

// Booking interfaces (same as provided)
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

interface Booking {
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
}

// API Response interface
interface ApiSeatCategory {
  seat_category_id: string;
  label: string;
  num_seats: number;
  price_per_seat: number;
  total_price: number;
}

interface ApiEvent {
  event_id: string;
  title: string;
  slug: string;
  organizer_name: string;
  location: string | null;
  address: string;
  event_date: string;
  event_time: string;
  event_duration: string;
  booking_date: string;
  card_image: string;
}

interface ApiUser {
  user_id: string;
  email: string;
  username: string;
}

interface ApiBookingResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  method: string;
  path: string;
  data: {
    order_id: string;
    booking_status: string;
    payment_status: string;
    payment_reference: string;
    created_at: string;
    updated_at: string;
    total_amount: number;
    event: ApiEvent;
    user: ApiUser;
    seat_categories: ApiSeatCategory[];
  };
}

// Transform API response to Booking interface
const transformApiBookingToBooking = (apiResponse: ApiBookingResponse): Booking => {
  const { data } = apiResponse;
  
  // Map booking_status to the expected enum values
  const bookingStatusMap: { [key: string]: Booking['booking_status'] } = {
    APPROVED: 'confirmed',
    PENDING: 'pending',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  };

  // Map payment_status to the expected enum values
  const paymentStatusMap: { [key: string]: Booking['payment_status'] } = {
    COMPLETED: 'paid',
    PENDING: 'pending',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  };

  return {
    booking_id: data.order_id,
    booking_reference: data.payment_reference,
    customer: {
      customer_id: data.user.user_id,
      name: data.user.username,
      email: data.user.email,
      phone: undefined, // Not provided in API response
      avatar: ""
    },
    event: {
      event_id: data.event.event_id,
      event_title: data.event.title,
      event_slug: data.event.slug,
      card_image: data.event.card_image,
      event_date: data.event.event_date,
      event_time: data.event.event_time,
      location: data.event.address
    },
    tickets: data.seat_categories.map((seat, index) => ({
      ticket_id: seat.seat_category_id,
      ticket_type: seat.label,
      price: seat.price_per_seat,
      quantity: seat.num_seats
    })),
    total_amount: data.total_amount,
    currency: "AUD", // Hardcoded as per mock data; adjust if API provides currency
    booking_status: bookingStatusMap[data.booking_status] || 'pending',
    payment_status: paymentStatusMap[data.payment_status] || 'pending',
    booking_date: data.event.booking_date,
    notes: undefined, // Not provided in API response
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

const BookingDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { userId } = useStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const bookingId = params.bookingId as string; // Adjusted to match route parameter name
console.log(bookingId)
  // Fetch booking details
  const fetchBookingDetails = async () => {
    if (!bookingId || !userId) {
      toast.error("Missing booking ID or user authentication");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get<ApiBookingResponse>(`/new-bookings/${bookingId}`);
      
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || "Failed to fetch booking details");
      }

      const transformedBooking = transformApiBookingToBooking(response.data);
      setBooking(transformedBooking);
    } catch (error: any) {
      console.error("Error fetching booking details:", error);
      toast.error("Failed to fetch booking details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/bookings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800"
  };

  const paymentColors = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/bookings')}
              className="h-10 w-10 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Booking Details
              </h1>
              <p className="text-sm text-gray-600">
                Reference: {booking.booking_reference}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBookingDetails}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.info("Download functionality coming soon!");
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {booking.event.event_title}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(booking.event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{booking.event.event_time}</span>
                  </div>
                  {booking.event.location && (
                    <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.event.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Ticket Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {booking.tickets.map((ticket, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{ticket.ticket_type || "Standard"}</h4>
                        <p className="text-sm text-gray-600">Quantity: {ticket.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {booking.currency} {ticket.price.toFixed(2)} each
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: {booking.currency} {(ticket.price * ticket.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>{booking.currency} {booking.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {booking.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{booking.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Booking Status</label>
                  <div className="mt-1">
                    <Badge className={statusColors[booking.booking_status]}>
                      {booking.booking_status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Status</label>
                  <div className="mt-1">
                    <Badge className={paymentColors[booking.payment_status]}>
                      {booking.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={booking.customer.avatar} />
                    <AvatarFallback>
                      {booking.customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{booking.customer.name}</h4>
                    <p className="text-sm text-gray-600">ID: {booking.customer.customer_id}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{booking.customer.email}</span>
                  </div>
                  {booking.customer.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{booking.customer.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Booked On</label>
                  <p className="text-sm">{new Date(booking.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-sm">{new Date(booking.updated_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Event Date</label>
                  <p className="text-sm">{new Date(booking.booking_date).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
