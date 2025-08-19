// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
// import { UnifiedSlotManager } from "./unified-slot-manager"

// export interface SeatCategory {
//   id: string
//   label: string
//   price: number
//   totalTickets: number
// }

// export interface TimeSlot {
//   id: string
//   time: string
//   duration: string
//   seatCategories: SeatCategory[]
// }

// export interface EventData {
//   eventId: string
//   selectedDates: string[]
//   slots: Record<string, TimeSlot[]>
// }

// interface EventOrganizerProps {
//   onEventSave: (eventData: EventData) => void
//   initialData?: Partial<EventData>
// }

// export function EventOrganizer({ onEventSave, initialData }: EventOrganizerProps) {
//   const [selectedDates, setSelectedDates] = useState<string[]>(initialData?.selectedDates || [])
//   const [slots, setSlots] = useState<Record<string, TimeSlot[]>>(initialData?.slots || {})
//   const [currentMonth, setCurrentMonth] = useState(new Date())

//   const defaultSeatCategories: SeatCategory[] = [
//     { id: "platinum", label: "Platinum", price: 150, totalTickets: 50 },
//     { id: "diamond", label: "Diamond", price: 120, totalTickets: 100 },
//     { id: "gold", label: "Gold", price: 80, totalTickets: 200 },
//     { id: "silver", label: "Silver", price: 50, totalTickets: 300 },
//   ]

//   const handleDateClick = (dateStr: string) => {
//     const today = new Date().toISOString().split("T")[0]
//     if (dateStr < today) return // Don't allow past dates

//     setSelectedDates((prev) => {
//       if (prev.includes(dateStr)) {
//         const newDates = prev.filter((d) => d !== dateStr)
//         setSlots((prevSlots) => {
//           const newSlots = { ...prevSlots }
//           delete newSlots[dateStr]
//           return newSlots
//         })
//         return newDates
//       } else {
//         return [...prev, dateStr].sort()
//       }
//     })
//   }

//   const addTimeSlot = (date: string) => {
//     const newSlot: TimeSlot = {
//       id: `slot-${Date.now()}`,
//       time: "10:00 AM",
//       duration: "2 hours",
//       seatCategories: [...defaultSeatCategories],
//     }

//     setSlots((prev) => ({
//       ...prev,
//       [date]: [...(prev[date] || []), newSlot],
//     }))
//   }

//   const updateTimeSlot = (date: string, slotId: string, field: keyof TimeSlot, value: any) => {
//     setSlots((prev) => ({
//       ...prev,
//       [date]: prev[date]?.map((slot) => (slot.id === slotId ? { ...slot, [field]: value } : slot)) || [],
//     }))
//   }

//   const deleteTimeSlot = (date: string, slotId: string) => {
//     setSlots((prev) => ({
//       ...prev,
//       [date]: prev[date]?.filter((slot) => slot.id !== slotId) || [],
//     }))
//   }

//   const updateSlotSeatCategory = (
//     date: string,
//     slotId: string,
//     categoryIndex: number,
//     field: keyof SeatCategory,
//     value: any,
//   ) => {
//     setSlots((prev) => ({
//       ...prev,
//       [date]:
//         prev[date]?.map((slot) =>
//           slot.id === slotId
//             ? {
//                 ...slot,
//                 seatCategories: slot.seatCategories.map((cat, i) =>
//                   i === categoryIndex ? { ...cat, [field]: value } : cat,
//                 ),
//               }
//             : slot,
//         ) || [],
//     }))
//   }

//   const addSlotSeatCategory = (date: string, slotId: string) => {
//     const newCategory: SeatCategory = {
//       id: `category-${Date.now()}`,
//       label: "New Category",
//       price: 0,
//       totalTickets: 0,
//     }

//     setSlots((prev) => ({
//       ...prev,
//       [date]:
//         prev[date]?.map((slot) =>
//           slot.id === slotId ? { ...slot, seatCategories: [...slot.seatCategories, newCategory] } : slot,
//         ) || [],
//     }))
//   }

//   const deleteSlotSeatCategory = (date: string, slotId: string, categoryIndex: number) => {
//     setSlots((prev) => ({
//       ...prev,
//       [date]:
//         prev[date]?.map((slot) =>
//           slot.id === slotId
//             ? { ...slot, seatCategories: slot.seatCategories.filter((_, i) => i !== categoryIndex) }
//             : slot,
//         ) || [],
//     }))
//   }

//   const addSlotToAllSelectedDates = (slotData?: Omit<TimeSlot, "id">) => {
//     const newSlot: TimeSlot = slotData || {
//       id: `slot-${Date.now()}`,
//       time: "10:00 AM",
//       duration: "2 hours",
//       seatCategories: [...defaultSeatCategories],
//     }

//     setSlots((prev) => {
//       const newSlots = { ...prev }
//       selectedDates.forEach((date) => {
//         newSlots[date] = [...(newSlots[date] || []), { ...newSlot, id: `slot-${Date.now()}-${date}` }]
//       })
//       return newSlots
//     })
//   }

//   const clearAllDates = () => {
//     setSelectedDates([])
//     setSlots({})
//   }

//   const renderCalendar = () => {
//     const year = currentMonth.getFullYear()
//     const month = currentMonth.getMonth()
//     const firstDay = new Date(year, month, 1)
//     const lastDay = new Date(year, month + 1, 0)
//     const startDate = new Date(firstDay)
//     startDate.setDate(startDate.getDate() - firstDay.getDay())

//     const days = []
//     const current = new Date(startDate)
//     const today = new Date().toISOString().split("T")[0]

//     for (let i = 0; i < 42; i++) {
//       const dateStr = current.toISOString().split("T")[0]
//       const isCurrentMonth = current.getMonth() === month
//       const isSelected = selectedDates.includes(dateStr)
//       const isPast = dateStr < today
//       const isToday = dateStr === today

//       days.push({
//         date: new Date(current),
//         dateStr,
//         day: current.getDate(),
//         isCurrentMonth,
//         isSelected,
//         isPast,
//         isToday,
//       })

//       current.setDate(current.getDate() + 1)
//     }

//     return days
//   }

//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr)
//     return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
//   }

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ]



//   const handleSaveEventConfiguration = () => {
//     const eventData: EventData = {
//       eventId: `event-${Date.now()}`,
//       selectedDates: selectedDates.sort(),
//       slots: slots,
//     }
//   console.log(JSON.stringify(eventData, null, 2)); // Pretty print JSON
//     if (onEventSave) {
//       onEventSave(eventData)
//     }
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-4 space-y-6">
//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold text-slate-900">Event Slot Manager</h1>
//         <p className="text-slate-600">Select dates individually or by range, then create time slots with pricing</p>
//         <p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
//           💡 Select multiple dates for bulk slot creation or manage individual date slots
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="w-5 h-5" />
//               Select Event Dates
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </Button>
//               <h3 className="font-semibold text-lg">
//                 {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
//               </h3>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </Button>
//             </div>

//             <div className="grid grid-cols-7 gap-1">
//               {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
//                 <div key={day} className="p-2 text-center text-sm font-medium text-slate-500">
//                   {day}
//                 </div>
//               ))}

//               {renderCalendar().map((day, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleDateClick(day.dateStr)}
//                   disabled={day.isPast}
//                   className={`
//                     p-2 text-sm rounded-lg transition-all duration-200 relative
//                     ${!day.isCurrentMonth ? "text-slate-300" : ""}
//                     ${day.isPast ? "text-slate-300 cursor-not-allowed" : "hover:bg-blue-50 cursor-pointer text-slate-900"}
//                     ${day.isSelected ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
//                     ${day.isToday && !day.isSelected ? "bg-slate-100 font-semibold" : ""}
//                   `}
//                 >
//                   {day.day}
//                 </button>
//               ))}
//             </div>

//             {selectedDates.length > 0 && (
//               <div className="space-y-3 pt-4 border-t">
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-medium text-slate-700">Selected Dates ({selectedDates.length}):</p>
//                   <Button variant="outline" size="sm" onClick={clearAllDates} className="text-xs bg-transparent">
//                     Clear All
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedDates.map((dateStr, index) => (
//                     <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
//                       {formatDate(dateStr)}
//                       <button onClick={() => handleDateClick(dateStr)} className="ml-2 hover:text-red-600">
//                         ×
//                       </button>
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="text-xs text-slate-500 text-center pt-2">
//               Click on multiple dates to select them. Use bulk creation for multiple dates.
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Clock className="w-5 h-5" />
//               Time Slots & Pricing
//               {selectedDates.length > 0 && (
//                 <Badge variant="outline" className="ml-auto">
//                   {Object.values(slots).flat().length} Total Slots
//                 </Badge>
//               )}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {selectedDates.length === 0 ? (
//               <div className="flex items-center justify-center py-16">
//                 <div className="text-center space-y-3">
//                   <Calendar className="w-16 h-16 mx-auto text-slate-300" />
//                   <p className="text-slate-500">Select dates to create time slots</p>
//                   <p className="text-xs text-slate-400">Click on calendar dates to get started</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6 max-h-[600px] overflow-y-auto">
//                 <UnifiedSlotManager
//                   selectedDates={selectedDates}
//                   slots={slots}
//                   onAddTimeSlot={addTimeSlot}
//                   onUpdateTimeSlot={updateTimeSlot}
//                   onDeleteTimeSlot={deleteTimeSlot}
//                   onUpdateSlotSeatCategory={updateSlotSeatCategory}
//                   onAddSlotSeatCategory={addSlotSeatCategory}
//                   onDeleteSlotSeatCategory={deleteSlotSeatCategory}
//                   onAddSlotToAllDates={addSlotToAllSelectedDates}
//                 />
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex justify-center pt-6">
//         <Button onClick={clearAllDates} size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8">
//           Clear All Dates
//         </Button>
//         <Button
//           onClick={handleSaveEventConfiguration}
//           size="lg"
//           className="bg-green-600 hover:bg-green-700 text-white px-8 ml-4"
//           disabled={selectedDates.length === 0}
//         >
//           Save Event Configuration
//           {selectedDates.length > 0 && (
//             <span className="ml-2 opacity-75">
//               ({selectedDates.length} dates, {Object.values(slots).flat().length} slots)
//             </span>
//           )}
//         </Button>
//       </div>
//     </div>
//   )
// }
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { UnifiedSlotManager } from "./unified-slot-manager";

export interface SeatCategory {
  id: string;
  label: string;
  price: number;
  totalTickets: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  duration: string;
  seatCategories: SeatCategory[];
}

export interface EventData {
  eventId: string;
  selectedDates: string[];
  slots: Record<string, TimeSlot[]>;
}

interface EventOrganizerProps {
  onEventSave: (eventData: EventData) => void;
  initialData?: Partial<EventData>;
}

export function EventOrganizer({ onEventSave, initialData }: EventOrganizerProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>(initialData?.selectedDates || []);
  const [slots, setSlots] = useState<Record<string, TimeSlot[]>>(initialData?.slots || {});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Use initialData.eventId if present, else fallback to timestamp
  const eventId = initialData?.eventId || `event-${Date.now()}`;

  const defaultSeatCategories: SeatCategory[] = [
    { id: "platinum", label: "Platinum", price: 150, totalTickets: 50 },
    { id: "diamond", label: "Diamond", price: 120, totalTickets: 100 },
    { id: "gold", label: "Gold", price: 80, totalTickets: 200 },
    { id: "silver", label: "Silver", price: 50, totalTickets: 300 },
  ];

  const handleDateClick = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    console.log(dateStr)
    if (dateStr < today) return;

    setSelectedDates((prev) => {
      if (prev.includes(dateStr)) {
        const newDates = prev.filter((d) => d !== dateStr);
        setSlots((prevSlots) => {
          const newSlots = { ...prevSlots };
          delete newSlots[dateStr];
          return newSlots;
        });
        return newDates;
      } else {
        return [...prev, dateStr].sort();
      }
    });
  };
console.log(selectedDates)
  const addTimeSlot = (date: string) => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      time: "10:00 AM",
      duration: "2 hours",
      seatCategories: [...defaultSeatCategories],
    };

    setSlots((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), newSlot],
    }));
  };

  const updateTimeSlot = (date: string, slotId: string, field: keyof TimeSlot, value: any) => {
    setSlots((prev) => ({
      ...prev,
      [date]: prev[date]?.map((slot) => (slot.id === slotId ? { ...slot, [field]: value } : slot)) || [],
    }));
  };

  const deleteTimeSlot = (date: string, slotId: string) => {
    setSlots((prev) => ({
      ...prev,
      [date]: prev[date]?.filter((slot) => slot.id !== slotId) || [],
    }));
  };

  const updateSlotSeatCategory = (
    date: string,
    slotId: string,
    categoryIndex: number,
    field: keyof SeatCategory,
    value: any,
  ) => {
    setSlots((prev) => ({
      ...prev,
      [date]:
        prev[date]?.map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                seatCategories: slot.seatCategories.map((cat, i) =>
                  i === categoryIndex ? { ...cat, [field]: value } : cat,
                ),
              }
            : slot,
        ) || [],
    }));
  };

  const addSlotSeatCategory = (date: string, slotId: string) => {
    const newCategory: SeatCategory = {
      id: `category-${Date.now()}`,
      label: "New Category",
      price: 0,
      totalTickets: 0,
    };

    setSlots((prev) => ({
      ...prev,
      [date]:
        prev[date]?.map((slot) =>
          slot.id === slotId ? { ...slot, seatCategories: [...slot.seatCategories, newCategory] } : slot,
        ) || [],
    }));
  };

  const deleteSlotSeatCategory = (date: string, slotId: string, categoryIndex: number) => {
    setSlots((prev) => ({
      ...prev,
      [date]:
        prev[date]?.map((slot) =>
          slot.id === slotId
            ? { ...slot, seatCategories: slot.seatCategories.filter((_, i) => i !== categoryIndex) }
            : slot,
        ) || [],
    }));
  };

  const addSlotToAllSelectedDates = (slotData?: Omit<TimeSlot, "id">) => {
    const newSlot: TimeSlot = slotData || {
      id: `slot-${Date.now()}`,
      time: "10:00 AM",
      duration: "2 hours",
      seatCategories: [...defaultSeatCategories],
    };

    setSlots((prev) => {
      const newSlots = { ...prev };
      selectedDates.forEach((date) => {
        newSlots[date] = [...(newSlots[date] || []), { ...newSlot, id: `slot-${Date.now()}-${date}` }];
      });
      return newSlots;
    });
  };

  const clearAllDates = () => {
    setSelectedDates([]);
    setSlots({});
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);
const today = new Date().toLocaleDateString("en-CA");

    for (let i = 0; i < 42; i++) {
    
const dateStr = current.toLocaleDateString("en-CA");

      const isCurrentMonth = current.getMonth() === month;
      const isSelected = selectedDates.includes(dateStr);

      const isPast = dateStr < today;
      const isToday = dateStr === today;

      days.push({
        date: new Date(current),
        dateStr,
        day: current.getDate(),
        isCurrentMonth,
        isSelected,
        isPast,
        isToday,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const getSeatCategoryColor = (categoryId: string): string => {
    const colors = {
      platinum: "bg-purple-50 text-purple-700 border-purple-200",
      diamond: "bg-blue-50 text-blue-700 border-blue-200",
      gold: "bg-amber-50 text-amber-700 border-amber-200",
      silver: "bg-slate-50 text-slate-700 border-slate-200",
    };
    return colors[categoryId as keyof typeof colors] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  const handleSaveEventConfiguration = () => {
    const eventData: EventData = {
      eventId, // Use the one from initialData/props, not a new timestamp!
      selectedDates: selectedDates.sort(),
      slots: slots,
    };
    if (onEventSave) {
      onEventSave(eventData);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Event Slot Manager</h1>
        <p className="text-slate-600">
          Select dates individually or by range, then create time slots with pricing
        </p>
        <p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
          💡 Select multiple dates for bulk slot creation or manage individual date slots
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Event Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h3 className="font-semibold text-lg">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-slate-500">
                  {day}
                </div>
              ))}

              {renderCalendar().map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(day.dateStr)}
                  disabled={day.isPast}
                  className={`
                    p-2 text-sm rounded-lg transition-all duration-200 relative
                    ${!day.isCurrentMonth ? "text-slate-300" : ""}
                    ${day.isPast ? "text-slate-300 cursor-not-allowed" : "hover:bg-blue-50 cursor-pointer text-slate-900"}
                    ${day.isSelected ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                    ${day.isToday && !day.isSelected ? "bg-slate-100 font-semibold" : ""}
                  `}
                >
                  {day.day}
                </button>
              ))}
            </div>

            {selectedDates.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">Selected Dates ({selectedDates.length}):</p>
                  <Button variant="outline" size="sm" onClick={clearAllDates} className="text-xs bg-transparent">
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDates.map((dateStr, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                      {formatDate(dateStr)}
                      <button onClick={() => handleDateClick(dateStr)} className="ml-2 hover:text-red-600">
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-slate-500 text-center pt-2">
              Click on multiple dates to select them. Use bulk creation for multiple dates.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Time Slots & Pricing
              {selectedDates.length > 0 && (
                <Badge variant="outline" className="ml-auto">
                  {Object.values(slots).flat().length} Total Slots
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDates.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-3">
                  <Calendar className="w-16 h-16 mx-auto text-slate-300" />
                  <p className="text-slate-500">Select dates to create time slots</p>
                  <p className="text-xs text-slate-400">Click on calendar dates to get started</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                <UnifiedSlotManager
                  selectedDates={selectedDates}
                  slots={slots}
                  onAddTimeSlot={addTimeSlot}
                  onUpdateTimeSlot={updateTimeSlot}
                  onDeleteTimeSlot={deleteTimeSlot}
                  onUpdateSlotSeatCategory={updateSlotSeatCategory}
                  onAddSlotSeatCategory={addSlotSeatCategory}
                  onDeleteSlotSeatCategory={deleteSlotSeatCategory}
                  onAddSlotToAllDates={addSlotToAllSelectedDates}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-6">
        <Button onClick={clearAllDates} size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8">
          Clear All Dates
        </Button>
        <Button
          onClick={handleSaveEventConfiguration}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8 ml-4"
          disabled={selectedDates.length === 0}
        >
          Save Event Configuration
          {selectedDates.length > 0 && (
            <span className="ml-2 opacity-75">
              ({selectedDates.length} dates, {Object.values(slots).flat().length} slots)
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
