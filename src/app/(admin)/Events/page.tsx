// "use client";

// import { useEffect, useState, useMemo, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DataTable } from "@/components/ui/data-table";
// import { createColumns, Event } from "./column";
// import axiosInstance from "@/lib/axiosinstance";
// import useStore from "@/lib/Zustand";
// import { toast } from "sonner";
// import { Calendar, Plus, RefreshCw } from "lucide-react";
// import { FeaturedEventModal } from "@/components/organizer/featuredevent/featured-event-modal";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// const CreateEventPage = () => {
//   const router = useRouter();
//   const { userId } = useStore();
// const [eventsData, setEventsData] = useState<{
//   upcoming: Event[];
//   past: Event[];
// }>({
//   upcoming: [],
//   past: [],
// });

//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [categoryFilter, setCategoryFilter] = useState<string>("all");
//   const [showFeaturedModal, setShowFeaturedModal] = useState(false);
//   const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
// const [filters, setFilters] = useState({
//   upcoming: { status: "all", category: "all" },
//   past: { status: "all", category: "all" },
// });
//   const [selectedEventForFeatured, setSelectedEventForFeatured] = useState<{
//     eventId: string;
//     eventName: string;
//     currentStatus: boolean;
//     start_date: string;
//     end_date: string;
//   } | null>(null);

//   // Fetch events
// const fetchEvents = useCallback(
//   async (tab: "upcoming" | "past" = activeTab) => {
//     try {
//       setLoading(true);

//       const endpoint =
//         tab === "upcoming"
//           ? `/new-events/new-analytics/organizer-details/${userId}?event_type=active`
//           : `/new-events/new-analytics/organizer-details/${userId}?event_type=past`;

//       const response = await axiosInstance.get(endpoint);

//       if (response.data.statusCode === 200) {
//         const eventsArr = response.data.data.events || [];
//         setEventsData((prev) => ({
//           ...prev,
//           [tab]: eventsArr, // ✅ store separately
//         }));
//         toast.success(`Loaded ${eventsArr.length} ${tab} events successfully!`);
//       } else {
//         toast.error(response.data.message || "Failed to fetch events");
//         setEventsData((prev) => ({
//           ...prev,
//           [tab]: [],
//         }));
//       }
//     } catch (error: any) {
//       console.error("Error fetching events:", error);
//       toast.error("Failed to fetch events. Please try again.");
//       setEventsData((prev) => ({
//         ...prev,
//         [tab]: [],
//       }));
//     } finally {
//       setLoading(false);
//     }
//   },
//   [activeTab, userId]
// );



//   // Toggle featured
//   const handleFeaturedToggle = useCallback(
//     (
//       eventId: string,
//       eventName: string,
//       currentStatus: boolean,
//       start_date: string,
//       end_date: string
//     ) => {
//       if (!currentStatus) {
//         setSelectedEventForFeatured({
//           eventId,
//           eventName,
//           currentStatus,
//           start_date,
//           end_date,
//         });
//         setShowFeaturedModal(true);
//       } else {
//         handleFeaturedUpdate(eventId, false);
//       }
//     },
//     []
//   );

// const events = eventsData[activeTab] || [];

// console.log("events",events)
//   // Update featured status
//   const handleFeaturedUpdate = useCallback(
//     async (
//       eventId: string,
//       isFeatured: boolean,
//       startDate?: string,
//       endDate?: string,
//       totalCost?: number
//     ) => {
//       try {
//         if (isFeatured) {
//           if (!startDate || !endDate || !totalCost) {
//             throw new Error("Missing required parameters for featuring event");
//           }
//           const start = new Date(startDate);
//           const end = new Date(endDate);
//           const diffTime = Math.abs(end.getTime() - start.getTime());
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//           const durationWeeks = Math.max(1, Math.ceil(diffDays / 7));

//           await axiosInstance.post(`/featured-events/`, {
//             user_ref_id: userId,
//             event_ref_id: eventId,
//             start_date: startDate,
//             end_date: endDate,
//             price: totalCost,
//             total_weeks: durationWeeks,
//           });
//           toast.success("Event featured successfully!");
//         } else {
//           await axiosInstance.patch(`/featured-events/featured/${eventId}`, {
//             featured_event: false,
//           });
//           toast.success("Event removed from featured list successfully!");
//         }

//         fetchEvents();
//       } catch (error: any) {
//         console.error("Error updating featured status:", error);
//         toast.error(
//           error.response?.data?.message || "Failed to update featured status"
//         );
//       }
//     },
//     [userId, fetchEvents]
//   );

//   const handleCreateCoupons = useCallback(
//     (eventId: string) => {
//       router.push(`/Coupons?eventId=${eventId}`);
//     },
//     [router]
//   );

//   const handleStatusToggle = useCallback(
//     async (
//       eventId: string,
//       currentStatus: "ACTIVE" | "INACTIVE" | "PENDING"
//     ) => {
//       if (currentStatus === "PENDING") return;

//       try {
//         const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

//         const formData = new URLSearchParams();
//         formData.append("event_status", newStatus);

//         await axiosInstance.patch(`/new-events/status/${eventId}`, formData, {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         });

//         toast.success(`Event status updated to ${newStatus} successfully!`);
//         fetchEvents();
//       } catch (error) {
//         console.error("Error updating event status:", error);
//         toast.error("Failed to update event status");
//       }
//     },
//     [fetchEvents]
//   );

//   const handleCreateSlots = useCallback(
//     (event: any) => {
//       router.push(
//         `/Events/Datespricing?event_id=${event}`
//       );
//     },
//     [router]
//   );

//   const handleDeleteEvent = useCallback(
//     async (eventId: string) => {
//       // Replace native confirm with a custom modal for better UX (optional)
//       if (!window.confirm("Are you sure you want to delete this event?")) return;

//       try {
//         await axiosInstance.delete(`/events/${eventId}`);
//         toast.success("Event deleted successfully");
//         fetchEvents();
//       } catch (error) {
//         console.error("Error deleting event:", error);
//         toast.error("Failed to delete event");
//       }
//     },
//     [fetchEvents]
//   );

//   // Unique categories
// const uniqueCategories = useMemo(() => {
//     const categoryMap: { [key: string]: { category_id: string; category_name: string; category_slug: string } } = {};
//     events.forEach((event) => {
//       if (event.category && !categoryMap[event.category.category_id]) {
//         categoryMap[event.category.category_id] = event.category;
//       }
//     });
//     return Object.values(categoryMap);
//   }, [events]);

//   // Filtered events
//   const filteredEvents = useMemo(() => {
//     return events?.filter((event) => {
//       const matchesStatus =
//         statusFilter === "all" ||
//         (statusFilter === "ACTIVE" && event.event_status === "ACTIVE") ||
//         (statusFilter === "INACTIVE" && event.event_status === "INACTIVE") ||
//         (statusFilter === "PENDING" && event.event_status === "PENDING");

//       const matchesCategory =
//         categoryFilter === "all" ||
//         event.category?.category_slug === categoryFilter;

//       return matchesStatus && matchesCategory;
//     });
//   }, [events, statusFilter, categoryFilter]);

//   // Columns
//   const columns = useMemo(
//     () =>
//       createColumns(
//         handleDeleteEvent,
//         handleFeaturedToggle,
//         handleCreateCoupons,
//         handleStatusToggle,
//         handleCreateSlots
//       ),
//     [
//       handleDeleteEvent,
//       handleFeaturedToggle,
//       handleCreateCoupons,
//       handleStatusToggle,
//       handleCreateSlots,
//     ]
//   );

//   useEffect(() => {
//     fetchEvents();
//   }, [fetchEvents]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
//           <div className="flex-1">
//             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
//               Events Management
//             </h1>
//             <p className="text-sm sm:text-base text-gray-600">
//               Create, manage, and track your events
//             </p>
//             {!loading && (
//               <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                 {filteredEvents?.length} of {events?.length} events
//               </p>
//             )}
//           </div>

//           <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
//             <Button
//               onClick={() => fetchEvents()}
//               variant="outline"
//               className="h-10 sm:h-11 px-3 sm:px-4 text-sm w-full sm:w-auto order-2 sm:order-1"
//               disabled={loading}
//             >
//               {loading ? (
//                 <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//               ) : (
//                 <RefreshCw className="h-4 w-4 mr-2" />
//               )}
//               {loading ? "Loading..." : "Refresh"}
//             </Button>
//             <Button
//               onClick={() => router.push("/Events/BasicInfo")}
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-10 sm:h-11 px-4 sm:px-6 shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2"
//             >
//               <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
//               <span className="hidden xs:inline">Create New Event</span>
//               <span className="xs:hidden">Create Event</span>
//             </Button>
//           </div>
//         </div>

//         {/* Filters */}
//         <Card className="mb-4 sm:mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//           <CardContent className="p-3 sm:p-4 lg:p-6">
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//               {/* Status Filter */}
//               <div className="w-full sm:w-auto">
//                 <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
//                   Status
//                 </label>
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-full sm:w-48 h-10">
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="ACTIVE">Active</SelectItem>
//                     <SelectItem value="INACTIVE">Inactive</SelectItem>
//                     <SelectItem value="PENDING">Pending</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Category Filter */}
//               <div className="w-full sm:w-auto">
//                 <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
//                   Category
//                 </label>
//                 <Select
//                   value={categoryFilter}
//                   onValueChange={setCategoryFilter}
//                 >
//                   <SelectTrigger className="w-full sm:w-48 h-10">
//                     <SelectValue placeholder="Filter by category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Categories</SelectItem>
//                     {uniqueCategories?.map((category) => (
//                       <SelectItem
//                         key={category.category_id}
//                         value={category.category_slug}
//                       >
//                         {category.category_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Events DataTable */}
//         {loading ? (
//           <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-3 sm:p-4 lg:p-6">
//               <div className="space-y-3 sm:space-y-4">
//                 {[...Array(5)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center space-x-3 sm:space-x-4"
//                   >
//                     <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
//                     <div className="flex-1 space-y-2 min-w-0">
//                       <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-full max-w-[200px]"></div>
//                       <div className="h-2 sm:h-3 bg-gray-200 rounded animate-pulse w-full max-w-[150px]"></div>
//                     </div>
//                     <div className="hidden sm:block h-8 w-16 sm:w-20 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
//                     <div className="h-8 w-8 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )  : (
//          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//   <CardContent className="p-6">
// <Tabs
//   value={activeTab}
//   onValueChange={(val) => {
//     setActiveTab(val as "upcoming" | "past");
//     fetchEvents(val as "upcoming" | "past");
//   }}
//   className="w-full"
// >
//   <TabsList className="mb-6">
//     <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
//     <TabsTrigger value="past">Past Events</TabsTrigger>
//   </TabsList>
// <TabsContent value="upcoming">
//   {loading ? (
//     <div className="text-center py-8 text-gray-500">Loading...</div>
//   ) : events.length === 0 ? (
//     <div className="text-center py-8">
//       <p className="text-gray-600">You have no upcoming events yet.</p>
//       <Button onClick={() => router.push("/Events/BasicInfo")} className="mt-4">
//         Create Your First Event
//       </Button>
//     </div>
//   ) : (
//     <DataTable
//       columns={columns}
//       data={events}
//       searchKey="event_title"
//       searchPlaceholder="Search upcoming events..."
//     />
//   )}
// </TabsContent>

// <TabsContent value="past">
//   {loading ? (
//     <div className="text-center py-8 text-gray-500">Loading...</div>
//   ) : events.length === 0 ? (
//     <div className="text-center py-8">
//       <p className="text-gray-600">No past events found.</p>
//     </div>
//   ) : (
//     <DataTable
//       columns={columns}
//       data={events}
//       searchKey="event_title"
//       searchPlaceholder="Search past events..."
//     />
//   )}
// </TabsContent>

// </Tabs>

//   </CardContent>
// </Card>

//         )}

//         {/* Featured Event Modal */}
//         {selectedEventForFeatured && (
//           <FeaturedEventModal
//             isOpen={showFeaturedModal}
//             onClose={() => {
//               setShowFeaturedModal(false);
//               setSelectedEventForFeatured(null);
//             }}
//             eventName={selectedEventForFeatured.eventName}
//             eventStartDate={selectedEventForFeatured.start_date}
//             eventEndDate={selectedEventForFeatured.end_date}
//             onConfirm={(startDate, endDate, totalCost) => {
//               handleFeaturedUpdate(
//                 selectedEventForFeatured.eventId,
//                 true,
//                 startDate,
//                 endDate,
//                 totalCost
//               );
//               setShowFeaturedModal(false);
//               setSelectedEventForFeatured(null);
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateEventPage;


"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { createColumns, Event } from "./column";
import axiosInstance from "@/lib/axiosinstance";
import useStore from "@/lib/Zustand";
import { toast } from "sonner";
import { Calendar, Plus, RefreshCw } from "lucide-react";
import { FeaturedEventModal } from "@/components/organizer/featuredevent/featured-event-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const CreateEventPage = () => {
  const router = useRouter();
  const { userId } = useStore();
  const [pageIndex, setPageIndex] = useState(0); // TanStack uses 0-based index
  const [pageSize, setPageSize] = useState(10); // Rows per page
  const [total, setTotal] = useState(0); // Total number of events
  const [eventsData, setEventsData] = useState<{
    upcoming: Event[];
    past: Event[];
  }>({
    upcoming: [],
    past: [],
  });

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [filters, setFilters] = useState({
    upcoming: { status: "all", category: "all" },
    past: { status: "all", category: "all" },
  });
  const [selectedEventForFeatured, setSelectedEventForFeatured] = useState<{
    eventId: string;
    eventName: string;
    currentStatus: boolean;
    start_date: string;
    end_date: string;
  } | null>(null);

  // Fetch events
  const fetchEvents = useCallback(
    async (tab: "upcoming" | "past" = activeTab, page = pageIndex, size = pageSize) => {
      try {
        setLoading(true);

        const endpoint =
          tab === "upcoming"
            ? `/new-events/new-analytics/organizer-details/${userId}?event_type=upcoming&page=${page + 1}&limit=${size}` // 1-based page
            : `/new-events/new-analytics/organizer-details/${userId}?event_type=completed&page=${page + 1}&limit=${size}`; // Adjust based on API

        const response = await axiosInstance.get(endpoint);

        if (response.data.statusCode === 200) {
          const eventsArr = response.data.data.events || [];
          setEventsData((prev) => ({
            ...prev,
            [tab]: eventsArr,
          }));
          setTotal(response.data.data.total || 0); // Update total from API response
         
        } else {
          toast.error(response.data.message || "Failed to fetch events");
          setEventsData((prev) => ({
            ...prev,
            [tab]: [],
          }));
          setTotal(0);
        }
      } catch (error: any) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events. Please try again.");
        setEventsData((prev) => ({
          ...prev,
          [tab]: [],
        }));
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [activeTab, userId, pageIndex, pageSize]
  );

  // Toggle featured
  const handleFeaturedToggle = useCallback(
    (eventId: string, eventName: string, currentStatus: boolean, start_date: string, end_date: string) => {
      if (!currentStatus) {
        setSelectedEventForFeatured({
          eventId,
          eventName,
          currentStatus,
          start_date,
          end_date,
        });
        setShowFeaturedModal(true);
      } else {
        handleFeaturedUpdate(eventId, false);
      }
    },
    []
  );

  const events = eventsData[activeTab] || [];

  console.log("events", events);

  // Update featured status
  const handleFeaturedUpdate = useCallback(
    async (eventId: string, isFeatured: boolean, startDate?: string, endDate?: string, totalCost?: number) => {
      try {
        if (isFeatured) {
          if (!startDate || !endDate || !totalCost) {
            throw new Error("Missing required parameters for featuring event");
          }
          const start = new Date(startDate);
          const end = new Date(endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const durationWeeks = Math.max(1, Math.ceil(diffDays / 7));

          await axiosInstance.post(`/featured-events/`, {
            user_ref_id: userId,
            event_ref_id: eventId,
            start_date: startDate,
            end_date: endDate,
            price: totalCost,
            total_weeks: durationWeeks,
          });
          toast.success("Event featured successfully!");
        } else {
          await axiosInstance.patch(`/featured-events/featured/${eventId}`, {
            featured_event: false,
          });
          toast.success("Event removed from featured list successfully!");
        }

        fetchEvents();
      } catch (error: any) {
        console.error("Error updating featured status:", error);
        toast.error(error.response?.data?.message || "Failed to update featured status");
      }
    },
    [userId, fetchEvents]
  );

  const handleCreateCoupons = useCallback(
    (eventId: string) => {
      router.push(`/Coupons?eventId=${eventId}`);
    },
    [router]
  );

  const handleStatusToggle = useCallback(
    async (eventId: string, currentStatus: "ACTIVE" | "INACTIVE" | "PENDING") => {
      if (currentStatus === "PENDING") return;

      try {
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        const formData = new URLSearchParams();
        formData.append("event_status", newStatus);

        await axiosInstance.patch(`/new-events/status/${eventId}`, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        toast.success(`Event status updated to ${newStatus} successfully!`);
        fetchEvents();
      } catch (error) {
        console.error("Error updating event status:", error);
        toast.error("Failed to update event status");
      }
    },
    [fetchEvents]
  );

  const handleCreateSlots = useCallback(
    (event: any) => {
      router.push(`/Events/Datespricing?event_id=${event}`);
    },
    [router]
  );

  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      if (!window.confirm("Are you sure you want to delete this event?")) return;

      try {
        await axiosInstance.delete(`/events/${eventId}`);
        toast.success("Event deleted successfully");
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
      }
    },
    [fetchEvents]
  );

  // Unique categories
  const uniqueCategories = useMemo(() => {
    const categoryMap: { [key: string]: { category_id: string; category_name: string; category_slug: string } } = {};
    events.forEach((event) => {
      if (event.category && !categoryMap[event.category.category_id]) {
        categoryMap[event.category.category_id] = event.category;
      }
    });
    return Object.values(categoryMap);
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events?.filter((event) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "ACTIVE" && event.event_status === "ACTIVE") ||
        (statusFilter === "INACTIVE" && event.event_status === "INACTIVE") ||
        (statusFilter === "PENDING" && event.event_status === "PENDING");

      const matchesCategory =
        categoryFilter === "all" || event.category?.category_slug === categoryFilter;

      return matchesStatus && matchesCategory;
    });
  }, [events, statusFilter, categoryFilter]);

  // Columns
  const columns = useMemo(
    () =>
      createColumns(
        handleDeleteEvent,
        handleFeaturedToggle,
        handleCreateCoupons,
        handleStatusToggle,
        handleCreateSlots
      ),
    [
      handleDeleteEvent,
      handleFeaturedToggle,
      handleCreateCoupons,
      handleStatusToggle,
      handleCreateSlots,
    ]
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle page change
  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
    fetchEvents(activeTab, newPageIndex, pageSize); // Fetch new page
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageIndex(0); // Reset to first page
    fetchEvents(activeTab, 0, newPageSize); // Fetch with new page size
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
              Events Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Create, manage, and track your events
            </p>
            {!loading && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {filteredEvents?.length} of {total} events
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              onClick={() => fetchEvents()}
              variant="outline"
              className="h-10 sm:h-11 px-3 sm:px-4 text-sm w-full sm:w-auto order-2 sm:order-1"
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
              onClick={() => router.push("/Events/BasicInfo")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-10 sm:h-11 px-4 sm:px-6 shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="hidden xs:inline">Create New Event</span>
              <span className="xs:hidden">Create Event</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-4 sm:mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Status Filter */}
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-10">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
                  Category
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-10">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories?.map((category) => (
                      <SelectItem
                        key={category.category_id}
                        value={category.category_slug}
                      >
                        {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events DataTable */}
        {loading ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="space-y-3 sm:space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 sm:space-x-4"
                  >
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
        ) : (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={(val) => {
                  setActiveTab(val as "upcoming" | "past");
                  setPageIndex(0); // Reset to first page when switching tabs
                  fetchEvents(val as "upcoming" | "past", 0, pageSize);
                }}
                className="w-full"
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                  <TabsTrigger value="past">Past Events</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                  ) : events.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">You have no upcoming events yet.</p>
                      <Button onClick={() => router.push("/Events/BasicInfo")} className="mt-4">
                        Create Your First Event
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={filteredEvents} // Use filtered events
                      searchKey="event_title"
                      searchPlaceholder="Search upcoming events..."
                      pageIndex={pageIndex}
                      pageSize={pageSize}
                      total={total}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  )}
                </TabsContent>

                <TabsContent value="past">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                  ) : events.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No past events found.</p>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={filteredEvents} // Use filtered events
                      searchKey="event_title"
                      searchPlaceholder="Search past events..."
                      pageIndex={pageIndex}
                      pageSize={pageSize}
                      total={total}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Featured Event Modal */}
        {selectedEventForFeatured && (
          <FeaturedEventModal
            isOpen={showFeaturedModal}
            onClose={() => {
              setShowFeaturedModal(false);
              setSelectedEventForFeatured(null);
            }}
            eventName={selectedEventForFeatured.eventName}
            eventStartDate={selectedEventForFeatured.start_date}
            eventEndDate={selectedEventForFeatured.end_date}
            onConfirm={(startDate, endDate, totalCost) => {
              handleFeaturedUpdate(
                selectedEventForFeatured.eventId,
                true,
                startDate,
                endDate,
                totalCost
              );
              setShowFeaturedModal(false);
              setSelectedEventForFeatured(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CreateEventPage;