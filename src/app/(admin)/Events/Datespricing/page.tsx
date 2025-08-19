'use client';

import { EventOrganizer } from "@/components/event-organizer";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";
export default function Home() {
  // Helper to convert your state to the required API payload
const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event_id");
  function transformToApiPayload(eventData: any) {
    const slot_data: Record<string, any[]> = {};
    for (const date of eventData.selectedDates) {
      slot_data[date] = (eventData.slots[date] || []).map((slot: any) => ({
        time: slot.time,
        duration: slot.duration,
        seatCategories: slot.seatCategories.map((category: any) => ({
          id: category.id,
          label: category.label,
          price: category.price,
          totalTickets: category.totalTickets,
          booked: 0,
          held: 0,
        })),
      }));
    }
    return {
      event_ref_id: eventData.eventId, // Will come from params
      event_dates: eventData.selectedDates,
      slot_data,
    };
  }

  const handleEventSave = async (eventData: any) => {

    // Use the eventId from route params
    const payload = transformToApiPayload({ ...eventData, eventId: eventId });
    console.log(payload)
    try {
      const response = await axiosInstance.post("/new-slots/create", payload);
     
     
      toast.success("Event saved successfully!");
      // Optionally, you can do more with result here
      router.push('/Events')
    } catch (err: any) {
      alert("Error saving event: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Pass the eventId as initialData to the component */}
      <EventOrganizer onEventSave={handleEventSave} initialData={{ eventId: eventId }} />
    </div>
  );
}
