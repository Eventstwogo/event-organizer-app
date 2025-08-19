// "use client"

// import { useEffect, useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { ArrowLeft, Calendar, Clock, Ticket, RefreshCcw, MapPin, TrendingUp } from "lucide-react"
// import axiosInstance from "@/lib/axiosinstance"
// import { toast } from "sonner"

// // Define interfaces based on the API response
// interface SeatCategory {
//   seat_category_id: string
//   label: string
//   price: number
//   totalTickets: number
//   booked: number
//   held: number
//   available: number
// }

// interface Slot {
//   slot_id: string
//   time: string
//   duration: string
//   end_time: string
//   seatCategories: SeatCategory[]
// }

// interface SlotData {
//   [date: string]: Slot[]
// }

// interface SlotAnalyticsPerDay {
//   total_slots: number
//   total_tickets: number
//   booked_tickets: number
//   held_tickets: number
//   available_tickets: number
// }

// interface SlotAnalytics {
//   overall_slots: number
//   overall_tickets: number
//   overall_booked: number
//   overall_held: number
//   overall_available: number
//   per_day: {
//     [date: string]: SlotAnalyticsPerDay
//   }
// }

// interface EventSlot {
//   event_ref_id: string
//   event_dates: string[]
//   slot_data: SlotData
//   slot_analytics: SlotAnalytics
// }

// interface Event {
//   event_id: string
//   event_title: string
//   event_slug: string
//   event_dates: string[]
//   location: string | null
//   address: string
//   slots: EventSlot[]
// }

// interface ApiEventResponse {
//   statusCode: number
//   message: string
//   timestamp: string
//   method: string
//   path: string
//   data: {
//     event_id: string
//     event_title: string
//     event_slug: string
//     event_dates: string[]
//     location: string | null
//     extra_data: {
//       address: string
//     }
//     slots: EventSlot[]
//   }
// }

// const EventBookingsPage = () => {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const eventId = searchParams.get("event_id")
//   const [event, setEvent] = useState<Event | null>(null)
//   const [loading, setLoading] = useState(true)

//   // Log for debugging
//   console.log("Event ID from query:", eventId)

//   // Fetch event details
//   const fetchEventDetails = async () => {
//     if (!eventId) {
//       toast.error("Missing event ID")
//       setLoading(false)
//       return
//     }

//     try {
//       setLoading(true)
//       const response = await axiosInstance.get<ApiEventResponse>(`/new-events/${eventId}`)

//       if (response.data.statusCode !== 200) {
//         throw new Error(response.data.message || "Failed to fetch event details")
//       }

//       const { data } = response.data
//       setEvent({
//         event_id: data.event_id,
//         event_title: data.event_title,
//         event_slug: data.event_slug,
//         event_dates: data.event_dates,
//         location: data.location || data.extra_data.address,
//         address: data.extra_data.address,
//         slots: data.slots,
//       })
//     } catch (error: any) {
//       console.error("Error fetching event details:", error.message, error.response?.data)
//       toast.error("Failed to fetch event details. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchEventDetails()
//   }, [eventId])

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
//           <div className="space-y-8">
//             <div className="flex items-center gap-6">
//               <div className="h-12 w-12 bg-muted rounded-xl animate-pulse"></div>
//               <div className="space-y-3">
//                 <div className="h-10 w-80 bg-muted rounded-lg animate-pulse"></div>
//                 <div className="h-5 w-40 bg-muted/70 rounded animate-pulse"></div>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 gap-8">
//               <div className="h-80 bg-card border border-border rounded-xl animate-pulse shadow-sm"></div>
//               <div className="h-64 bg-card border border-border rounded-xl animate-pulse shadow-sm"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!event) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
//           <div className="text-center py-20">
//             <div className="max-w-md mx-auto space-y-6">
//               <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
//                 <Calendar className="h-10 w-10 text-muted-foreground" />
//               </div>
//               <div className="space-y-2">
//                 <h2 className="text-3xl font-bold text-foreground">Event Not Found</h2>
//                 <p className="text-muted-foreground text-lg">
//                   The event you're looking for doesn't exist or has been removed.
//                 </p>
//               </div>
//               <Button onClick={() => router.push("/Events")} size="lg" className="gap-2">
//                 <ArrowLeft className="h-4 w-4" />
//                 Back to Events
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
//           <div className="flex items-center gap-6">
//             <Button
//               variant="outline"
//               size="lg"
//               onClick={() => router.push("/Events")}
//               className="h-12 w-12 p-0 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
//             >
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//             <div className="space-y-2">
//               <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">{event.event_title}</h1>
//               <div className="flex items-center gap-4 text-muted-foreground">
//                 <span className="text-sm font-medium">Event ID: {event.event_id}</span>
//                 {event.location && (
//                   <div className="flex items-center gap-1">
//                     <MapPin className="h-4 w-4" />
//                     <span className="text-sm">{event.location}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <Button
//             variant="outline"
//             size="lg"
//             onClick={fetchEventDetails}
//             disabled={loading}
//             className="gap-2 border-2 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all duration-200 bg-transparent"
//           >
//             <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
//             Refresh Data
//           </Button>
//         </div>

//         <div className="space-y-8">
//           {event.slots.map((slot, slotIndex) => (
//             <Card key={slotIndex} className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader className="bg-card/50 border-b border-border">
//                 <CardTitle className="flex items-center gap-3 text-xl">
//                   <div className="p-2 bg-primary/10 rounded-lg">
//                     <Calendar className="h-6 w-6 text-primary" />
//                   </div>
//                   <div>
//                     <span>Event Slots</span>
//                     <p className="text-sm font-normal text-muted-foreground mt-1">{slot.event_dates.join(", ")}</p>
//                   </div>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-8 space-y-8">
//                 {Object.entries(slot.slot_data).map(([date, slots]) => (
//                   <div key={date} className="space-y-6">
//                     <div className="flex items-center gap-3 pb-4 border-b border-border">
//                       <div className="p-2 bg-secondary/10 rounded-lg">
//                         <Calendar className="h-5 w-5 text-secondary" />
//                       </div>
//                       <h3 className="text-2xl font-bold text-foreground">
//                         {new Date(date).toLocaleDateString("en-US", {
//                           weekday: "long",
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })}
//                       </h3>
//                     </div>

//                     <div className="grid gap-6">
//                       {slots.map((slotData, index) => (
//                         <Card
//                           key={index}
//                           className="border border-border bg-card/30 hover:bg-card/60 transition-all duration-200"
//                         >
//                           <CardContent className="p-6">
//                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//                               <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-primary/10 rounded-lg">
//                                   <Clock className="h-5 w-5 text-primary" />
//                                 </div>
//                                 <div>
//                                   <span className="text-lg font-semibold text-foreground">
//                                     {slotData.time} - {slotData.end_time}
//                                   </span>
//                                   <p className="text-sm text-muted-foreground">Duration: {slotData.duration}</p>
//                                 </div>
//                               </div>
//                               <Badge variant="secondary" className="text-sm px-3 py-1">
//                                 ID: {slotData.slot_id}
//                               </Badge>
//                             </div>

//                             <Separator className="my-6" />

//                             <div className="space-y-4">
//                               <div className="flex items-center gap-2 mb-4">
//                                 <Ticket className="h-5 w-5 text-primary" />
//                                 <h4 className="text-lg font-semibold text-foreground">Seat Categories</h4>
//                               </div>
//                               <div className="grid gap-4">
//                                 {slotData.seatCategories.map((category) => (
//                                   <div
//                                     key={category.seat_category_id}
//                                     className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-background/50 rounded-lg border border-border"
//                                   >
//                                     <div className="space-y-1">
//                                       <p className="font-semibold text-foreground text-lg">{category.label}</p>
//                                       <p className="text-primary font-bold text-xl">AUD ${category.price.toFixed(2)}</p>
//                                     </div>
//                                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
//                                       <div className="text-center">
//                                         <p className="font-medium text-foreground">{category.totalTickets}</p>
//                                         <p className="text-muted-foreground">Total</p>
//                                       </div>
//                                       <div className="text-center">
//                                         <p className="font-medium text-destructive">{category.booked}</p>
//                                         <p className="text-muted-foreground">Booked</p>
//                                       </div>
//                                       <div className="text-center">
//                                         <p className="font-medium text-orange-600">{category.held}</p>
//                                         <p className="text-muted-foreground">Held</p>
//                                       </div>
//                                       <div className="text-center">
//                                         <p className="font-medium text-primary">{category.available}</p>
//                                         <p className="text-muted-foreground">Available</p>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>

//                     {slot.slot_analytics.per_day[date] && (
//                       <Card className="bg-primary/5 border-primary/20">
//                         <CardContent className="p-6">
//                           <div className="flex items-center gap-3 mb-4">
//                             <div className="p-2 bg-primary/10 rounded-lg">
//                               <TrendingUp className="h-5 w-5 text-primary" />
//                             </div>
//                             <h4 className="text-lg font-semibold text-foreground">
//                               Analytics for {new Date(date).toLocaleDateString()}
//                             </h4>
//                           </div>
//                           <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
//                             <div className="text-center p-3 bg-background/50 rounded-lg">
//                               <p className="text-2xl font-bold text-foreground">
//                                 {slot.slot_analytics.per_day[date].total_slots}
//                               </p>
//                               <p className="text-sm text-muted-foreground">Total Slots</p>
//                             </div>
//                             <div className="text-center p-3 bg-background/50 rounded-lg">
//                               <p className="text-2xl font-bold text-foreground">
//                                 {slot.slot_analytics.per_day[date].total_tickets}
//                               </p>
//                               <p className="text-sm text-muted-foreground">Total Tickets</p>
//                             </div>
//                             <div className="text-center p-3 bg-background/50 rounded-lg">
//                               <p className="text-2xl font-bold text-destructive">
//                                 {slot.slot_analytics.per_day[date].booked_tickets}
//                               </p>
//                               <p className="text-sm text-muted-foreground">Booked</p>
//                             </div>
//                             <div className="text-center p-3 bg-background/50 rounded-lg">
//                               <p className="text-2xl font-bold text-orange-600">
//                                 {slot.slot_analytics.per_day[date].held_tickets}
//                               </p>
//                               <p className="text-sm text-muted-foreground">Held</p>
//                             </div>
//                             <div className="text-center p-3 bg-background/50 rounded-lg">
//                               <p className="text-2xl font-bold text-primary">
//                                 {slot.slot_analytics.per_day[date].available_tickets}
//                               </p>
//                               <p className="text-sm text-muted-foreground">Available</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     )}
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EventBookingsPage


"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Ticket,
  RefreshCcw,
  MapPin,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react"
import axiosInstance from "@/lib/axiosinstance"
import { toast } from "sonner"

// Define interfaces based on the API response
interface SeatCategory {
  seat_category_id: string
  label: string
  price: number
  totalTickets: number
  booked: number
  held: number
  available: number
}

interface Slot {
  slot_id: string
  time: string
  duration: string
  end_time: string
  seatCategories: SeatCategory[]
}

interface SlotData {
  [date: string]: Slot[]
}

interface SlotAnalyticsPerDay {
  total_slots: number
  total_tickets: number
  booked_tickets: number
  held_tickets: number
  available_tickets: number
}

interface SlotAnalytics {
  overall_slots: number
  overall_tickets: number
  overall_booked: number
  overall_held: number
  overall_available: number
  per_day: {
    [date: string]: SlotAnalyticsPerDay
  }
}

interface EventSlot {
  event_ref_id: string
  event_dates: string[]
  slot_data: SlotData
  slot_analytics: SlotAnalytics
}

interface Event {
  event_id: string
  event_title: string
  event_slug: string
  event_dates: string[]
  location: string | null
  address: string
  slots: EventSlot[]
}

interface ApiEventResponse {
  statusCode: number
  message: string
  timestamp: string
  method: string
  path: string
  data: {
    event_id: string
    event_title: string
    event_slug: string
    event_dates: string[]
    location: string | null
    extra_data: {
      address: string
    }
    slots: EventSlot[]
  }
}

const EventBookingsPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get("event_id")
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [datesPerPage, setDatesPerPage] = useState(10)
  const [searchDate, setSearchDate] = useState("")
  const [filteredDates, setFilteredDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Log for debugging
  console.log("Event ID from query:", eventId)

  // Fetch event details
  const fetchEventDetails = async () => {
    if (!eventId) {
      toast.error("Missing event ID")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await axiosInstance.get<ApiEventResponse>(`/new-events/${eventId}`)

      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || "Failed to fetch event details")
      }

      const { data } = response.data
      setEvent({
        event_id: data.event_id,
        event_title: data.event_title,
        event_slug: data.event_slug,
        event_dates: data.event_dates,
        location: data.location || data.extra_data.address,
        address: data.extra_data.address,
        slots: data.slots,
      })
    } catch (error: any) {
      console.error("Error fetching event details:", error.message, error.response?.data)
      toast.error("Failed to fetch event details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventDetails()
  }, [eventId])

  const getAllDates = () => {
    if (!event || !event.slots.length) return []

    const allDates = new Set<string>()
    event.slots.forEach((slot) => {
      Object.keys(slot.slot_data).forEach((date) => {
        allDates.add(date)
      })
    })

    return Array.from(allDates).sort()
  }

  useEffect(() => {
    const allDates = getAllDates()
    if (searchDate) {
      const filtered = allDates.filter(
        (date) =>
          date.toLowerCase().includes(searchDate.toLowerCase()) ||
          new Date(date)
            .toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            .toLowerCase()
            .includes(searchDate.toLowerCase()),
      )
      setFilteredDates(filtered)
    } else {
      setFilteredDates(allDates)
    }
    setCurrentPage(1)

    // Auto-select first date if none selected
    if (!selectedDate && allDates.length > 0) {
      setSelectedDate(allDates[0])
    }
  }, [event, searchDate])

  const totalPages = Math.ceil(filteredDates.length / datesPerPage)
  const startIndex = (currentPage - 1) * datesPerPage
  const endIndex = startIndex + datesPerPage
  const currentDates = filteredDates.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 bg-muted rounded-xl animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-10 w-80 bg-muted rounded-lg animate-pulse"></div>
                <div className="h-5 w-40 bg-muted/70 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="h-80 bg-card border border-border rounded-xl animate-pulse shadow-sm"></div>
              <div className="h-64 bg-card border border-border rounded-xl animate-pulse shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Event Not Found</h2>
                <p className="text-muted-foreground text-lg">
                  The event you're looking for doesn't exist or has been removed.
                </p>
              </div>
              <Button onClick={() => router.push("/Events")} size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/Events")}
              className="h-12 w-12 p-0 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">{event.event_title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="text-sm font-medium">Event ID: {event.event_id}</span>
                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={fetchEventDetails}
            disabled={loading}
            className="gap-2 border-2 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all duration-200 bg-transparent"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        <Card className="mb-8 border-2">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Filter & Navigation</span>
                </div>
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search dates..."
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={datesPerPage.toString()} onValueChange={(value) => setDatesPerPage(Number(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="15">15 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredDates.length)} of {filteredDates.length} dates
                </span>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="w-10 h-10 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8 border-2 shadow-lg">
          <CardHeader className="bg-card/50 border-b border-border">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span>Select Event Date</span>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  Click on a date to view available slots
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentDates.map((date) => (
                <Card
                  key={date}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedDate === date
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="text-lg font-semibold text-foreground">
                        {new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                        })}
                      </div>
                      {selectedDate === date && (
                        <div className="flex items-center justify-center gap-1 text-primary">
                          <ChevronDown className="h-4 w-4" />
                          <span className="text-xs font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedDate && (
          <div className="space-y-8">
            {event.slots.map((slot, slotIndex) => {
              // Only show slots for selected date
              const selectedSlots = slot.slot_data[selectedDate]

              if (!selectedSlots || selectedSlots.length === 0) return null

              return (
                <Card key={slotIndex} className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-card/50 border-b border-border">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <span>Available Slots</span>
                        <p className="text-sm font-normal text-muted-foreground mt-1">
                          {new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {selectedSlots.map((slotData, index) => (
                      <Card
                        key={index}
                        className="border border-border bg-card/30 hover:bg-card/60 transition-all duration-200"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Clock className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="text-lg font-semibold text-foreground">
                                  {slotData.time} - {slotData.end_time}
                                </span>
                                <p className="text-sm text-muted-foreground">Duration: {slotData.duration}</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-sm px-3 py-1">
                              ID: {slotData.slot_id}
                            </Badge>
                          </div>

                          <Separator className="my-6" />

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Ticket className="h-5 w-5 text-primary" />
                              <h4 className="text-lg font-semibold text-foreground">Seat Categories</h4>
                            </div>
                            <div className="grid gap-4">
                              {slotData.seatCategories.map((category) => (
                                <div
                                  key={category.seat_category_id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-background/50 rounded-lg border border-border"
                                >
                                  <div className="space-y-1">
                                    <p className="font-semibold text-foreground text-lg">{category.label}</p>
                                    <p className="text-primary font-bold text-xl">AUD ${category.price.toFixed(2)}</p>
                                  </div>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                    <div className="text-center">
                                      <p className="font-medium text-foreground">{category.totalTickets}</p>
                                      <p className="text-muted-foreground">Total</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="font-medium text-destructive">{category.booked}</p>
                                      <p className="text-muted-foreground">Booked</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="font-medium text-orange-600">{category.held}</p>
                                      <p className="text-muted-foreground">Held</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="font-medium text-primary">{category.available}</p>
                                      <p className="text-muted-foreground">Available</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {slot.slot_analytics.per_day[selectedDate] && (
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <h4 className="text-lg font-semibold text-foreground">
                              Analytics for {new Date(selectedDate).toLocaleDateString()}
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            <div className="text-center p-3 bg-background/50 rounded-lg">
                              <p className="text-2xl font-bold text-foreground">
                                {slot.slot_analytics.per_day[selectedDate].total_slots}
                              </p>
                              <p className="text-sm text-muted-foreground">Total Slots</p>
                            </div>
                            <div className="text-center p-3 bg-background/50 rounded-lg">
                              <p className="text-2xl font-bold text-foreground">
                                {slot.slot_analytics.per_day[selectedDate].total_tickets}
                              </p>
                              <p className="text-sm text-muted-foreground">Total Tickets</p>
                            </div>
                            <div className="text-center p-3 bg-background/50 rounded-lg">
                              <p className="text-2xl font-bold text-destructive">
                                {slot.slot_analytics.per_day[selectedDate].booked_tickets}
                              </p>
                              <p className="text-sm text-muted-foreground">Booked</p>
                            </div>
                            <div className="text-center p-3 bg-background/50 rounded-lg">
                              <p className="text-2xl font-bold text-orange-600">
                                {slot.slot_analytics.per_day[selectedDate].held_tickets}
                              </p>
                              <p className="text-sm text-muted-foreground">Held</p>
                            </div>
                            <div className="text-center p-3 bg-background/50 rounded-lg">
                              <p className="text-2xl font-bold text-primary">
                                {slot.slot_analytics.per_day[selectedDate].available_tickets}
                              </p>
                              <p className="text-sm text-muted-foreground">Available</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {!selectedDate && (
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Select a Date</h3>
                  <p className="text-muted-foreground">
                    Choose a date from above to view available slots and booking details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default EventBookingsPage
