"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DateSelection from "@/components/Event/Dates";
import TimeSlots from "@/components/Event/Slots";
import NewCategoriesPricing from "@/components/Event/NewCategoriesPricing";
import NewDateCreator from "@/components/Event/NewDateCreator";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "sonner";
import { TimeSlotPopup } from "@/components/eventcreationpopups/TimeSlotPopup";
import { CategoryPricingPopup } from "@/components/eventcreationpopups/CategoryPricingPopup";

/** Types must align with components/Event/Dates.tsx and components/Event/Slots.tsx */
interface TicketCategory {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface TimeSlotItem {
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  capacity: number;
  duration: string;  // "Xh Ym"
  seatCategories: TicketCategory[];
}

interface MyFormData {
  startDate: string;             // "YYYY-MM-DD"
  endDate: string;               // "YYYY-MM-DD"
  selectedDates: string[];       // ["YYYY-MM-DD"]
  timeSlots: { [date: string]: TimeSlotItem[] }; // keyed by "YYYY-MM-DD"
}

/* ---------- utils ---------- */
const isoDate = (d: Date) => d.toISOString().split("T")[0];

const getDatesBetween = (startDate: string, endDate: string) => {
  const out: string[] = [];
  if (!startDate || !endDate) return out;
  const start = new Date(startDate);
  const end = new Date(endDate);
  // normalize to 00:00 to avoid TZ creep
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const cur = new Date(start);
  while (cur.getTime() <= end.getTime()) {
    out.push(isoDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
};

const formatDuration = (start: string, end: string) => {
  if (!start || !end) return "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

// For API payload: "1 hour", "20 minutes", or "1 hour 20 minutes"
const formatDurationVerbose = (start: string, end: string) => {
  if (!start || !end) return "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hPart = h > 0 ? `${h} ${h === 1 ? "hour" : "hours"}` : "";
  const mPart = m > 0 ? `${m} ${m === 1 ? "minute" : "minutes"}` : "";
  if (hPart && mPart) return `${hPart} ${mPart}`;
  return hPart || mPart;
};

const formatTime24to12 = (time24: string) => {
  if (!time24) return "";
  const [hStr, minute] = time24.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${minute} ${ampm}`;
};

// Parse verbose durations like "1 hour 20 minutes" to total minutes
const parseVerboseDurationToMinutes = (duration: string): number => {
  if (!duration) return 0;
  const hourMatch = duration.match(/(\d+)\s*hour/i);
  const minuteMatch = duration.match(/(\d+)\s*minute/i);
  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  return hours * 60 + minutes;
};

// Given start HH:mm and minutes, return end HH:mm
const calcEndTime = (start: string, minutesToAdd: number): string => {
  const [h, m] = start.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  d.setMinutes(d.getMinutes() + (Number.isFinite(minutesToAdd) ? minutesToAdd : 0));
  const eh = d.getHours().toString().padStart(2, "0");
  const em = d.getMinutes().toString().padStart(2, "0");
  return `${eh}:${em}`;
};

/* ---------- component ---------- */
export default function CreateDatesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const eventId = params.get("event_id");

  /* Month range control */
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [formData, setFormData] = useState<MyFormData>(() => {
    const start = isoDate(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1));
    const end = isoDate(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0));
    return { startDate: start, endDate: end, selectedDates: [], timeSlots: {} };
  });

  const [activeDate, setActiveDate] = useState<string>("");

  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(visibleMonth),
    [visibleMonth]
  );

  /* Allowed dates fetched from backend to prevent 400s (optional) */
  const [allowedDates, setAllowedDates] = useState<string[] | null>(null);
  useEffect(() => {
    const fetchAllowed = async () => {
      if (!eventId) return;
      try {
        const res = await axiosInstance.get(`/new-slots/valid-dates?event_ref_id=${eventId}`);
        if (Array.isArray(res.data?.data)) {
          setAllowedDates(res.data.data);
        } else if (Array.isArray(res.data)) {
          setAllowedDates(res.data);
        } else {
          setAllowedDates(null);
        }
      } catch {
        setAllowedDates(null);
      }
    };
    fetchAllowed();
  }, [eventId]);

  // Prefill previously saved slot configuration for this event
  useEffect(() => {
    const fetchExisting = async () => {
      if (!eventId) return;
      try {
        const res = await axiosInstance.get(`/new-slots/get/${eventId}`);
        const data = res.data?.data;
        if (!data) return;

        // Build timeSlots map in our local shape
        const nextTimeSlots: MyFormData["timeSlots"] = {};
        Object.keys(data.slot_data || {}).forEach((date: string) => {
          const slots = data.slot_data[date] || [];
          nextTimeSlots[date] = slots.map((slot: any) => {
            const startTime24 = (() => {
              // slot.time expected like "10:00 AM" → convert
              const [time, modifier] = String(slot.time || "").split(" ");
              const [hStr, mStr] = (time || "00:00").split(":");
              let h = parseInt(hStr || "0", 10);
              const m = parseInt(mStr || "0", 10);
              if (modifier === "PM" && h !== 12) h += 12;
              if (modifier === "AM" && h === 12) h = 0;
              return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
            })();
            const minutes = parseVerboseDurationToMinutes(String(slot.duration || ""));
            const endTime24 = calcEndTime(startTime24, minutes);
            return {
              startTime: startTime24,
              endTime: endTime24,
              capacity: Array.isArray(slot.seatCategories)
                ? slot.seatCategories.reduce((sum: number, c: any) => sum + (Number(c.totalTickets) || 0), 0)
                : 0,
              duration: String(slot.duration || ""),
              seatCategories: (slot.seatCategories || []).map((c: any, idx: number) => ({
                id: c.seat_category_id || `${(c.label || "cat").toLowerCase().replace(/\s+/g, "_")}_${startTime24.replace(":", "")}_${idx + 1}`,
                name: c.label,
                price: Number(c.price) || 0,
                quantity: Number(c.totalTickets) || 0,
              })),
            } as TimeSlotItem;
          });
        });

        // Store existing dates to show read-only to the user (avoid confusion)
        if (Array.isArray(data.event_dates)) {
          setExistingDates(data.event_dates);
        }

        // Do NOT auto-populate selectedDates/timeSlots for creation flow
        // Keep current user selections untouched
      } catch (e) {
        // Silent if not found; show toast only on explicit error
        // console.error(e);
      }
    };
    fetchExisting();
  }, [eventId]);

  /* Two-step flow: 1) Dates & Slots, 2) Categories & Pricing */
  const [step, setStep] = useState<1 | 2>(1);

  // Dates that already exist in backend (read-only display)
  const [existingDates, setExistingDates] = useState<string[]>([]);

  /* keep month range in sync with calendar navigation */
  const syncMonthRange = (month: Date) => {
    const start = isoDate(new Date(month.getFullYear(), month.getMonth(), 1));
    const end = isoDate(new Date(month.getFullYear(), month.getMonth() + 1, 0));
    setFormData((prev) => ({ ...prev, startDate: start, endDate: end }));
  };

  const onPrevMonth = () => {
    const m = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    m.setHours(0, 0, 0, 0);
    setVisibleMonth(m);
    syncMonthRange(m);
  };

  const onNextMonth = () => {
    const m = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    m.setHours(0, 0, 0, 0);
    setVisibleMonth(m);
    syncMonthRange(m);
  };

  /* date selection */
  const toggleDateSelection = (date: string) => {
    // Prevent selecting dates that already exist in backend to avoid confusion
    if (existingDates.includes(date)) return;
    setFormData((prev) => {
      const selected = new Set(prev.selectedDates);
      if (selected.has(date)) selected.delete(date);
      else selected.add(date);
      const nextSelected = Array.from(selected).sort();
      if (!nextSelected.includes(activeDate)) {
        setActiveDate(nextSelected[0] || "");
      }
      return { ...prev, selectedDates: nextSelected };
    });
  };

  /* slots CRUD */
  const addTimeSlot = (date: string) => {
    setFormData((prev) => {
      const slots = prev.timeSlots[date] ? [...prev.timeSlots[date]] : [];
      const start = "10:00";
      const end = "12:00";
      const newSlot: TimeSlotItem = {
        startTime: start,
        endTime: end,
        capacity: 0,
        duration: formatDuration(start, end),
        seatCategories: [],
      };
      return { ...prev, timeSlots: { ...prev.timeSlots, [date]: [...slots, newSlot] } };
    });
  };

  const updateTimeSlot = (
    date: string,
    index: number,
    field: keyof TimeSlotItem | string,
    value: string | number
  ) => {
    setFormData((prev) => {
      const slots = [...(prev.timeSlots[date] || [])];
      const slot = { ...slots[index] } as TimeSlotItem;
      (slot as any)[field] = value;
      if (field === "startTime" || field === "endTime") {
        slot.duration = formatDuration(slot.startTime, slot.endTime);
      }
      slots[index] = slot;
      return { ...prev, timeSlots: { ...prev.timeSlots, [date]: slots } };
    });
  };

  const removeTimeSlot = (date: string, index: number) => {
    setFormData((prev) => {
      const slots = [...(prev.timeSlots[date] || [])];
      slots.splice(index, 1);
      return { ...prev, timeSlots: { ...prev.timeSlots, [date]: slots } };
    });
  };

  /* Apply template: copy activeDate's slots to all other selected dates */
  const createApplyAllDatesTemplate = () => {
    if (!activeDate) {
      toast.error("Select an active date");
      return;
    }
    setFormData((prev) => {
      const baseSlots = prev.timeSlots[activeDate] || [];
      const cloneSlots = baseSlots.map((s) => ({
        startTime: s.startTime,
        endTime: s.endTime,
        capacity: s.capacity,
        duration: s.duration,
        seatCategories: (s.seatCategories || []).map((c) => ({ ...c })),
      }));
      const next: MyFormData["timeSlots"] = { ...prev.timeSlots };
      prev.selectedDates.forEach((d) => {
        if (d === activeDate) return;
        next[d] = cloneSlots.map((s) => ({
          startTime: s.startTime,
          endTime: s.endTime,
          capacity: s.capacity,
          duration: s.duration,
          seatCategories: (s.seatCategories || []).map((c) => ({ ...c })),
        }));
      });
      return { ...prev, timeSlots: next };
    });
   
  };

  /* ticket categories CRUD inside slots */
  const addTicketCategoryToSlot = (date: string, slotIndex: number) => {
    setFormData((prev) => {
      const slots = [...(prev.timeSlots[date] || [])];
      const slot = { ...slots[slotIndex] } as TimeSlotItem;
      const newCat: TicketCategory = {
        id: `cat-${Date.now()}`,
        name: "",
        price: 0,
        quantity: 0,
      };
      slot.seatCategories = [...(slot.seatCategories || []), newCat];
      slots[slotIndex] = slot;
      return { ...prev, timeSlots: { ...prev.timeSlots, [date]: slots } };
    });
  };

  const updateTicketCategoryInSlot = (
    date: string,
    slotIndex: number,
    categoryId: string,
    field: keyof TicketCategory,
    value: string | number
  ) => {
    setFormData((prev) => {
      const slots = [...(prev.timeSlots[date] || [])];
      const slot = { ...slots[slotIndex] } as TimeSlotItem;
      slot.seatCategories = (slot.seatCategories || []).map((c) =>
        c.id === categoryId ? { ...c, [field]: value } : c
      );
      slots[slotIndex] = slot;
      return { ...prev, timeSlots: { ...prev.timeSlots, [date]: slots } };
    });
  };

  const removeTicketCategoryFromSlot = (date: string, slotIndex: number, categoryId: string) => {
    setFormData((prev) => {
      const slots = [...(prev.timeSlots[date] || [])];
      const slot = { ...slots[slotIndex] } as TimeSlotItem;
      slot.seatCategories = (slot.seatCategories || []).filter((c) => c.id !== categoryId);
      slots[slotIndex] = slot;
      return { ...prev, timeSlots: { ...prev.timeSlots, [date]: slots } };
    });
  };

  /* Apply categories from activeDate across all matching time ranges */
  const createApplyAllSlotsTemplate = () => {
    if (!activeDate) {
      toast.error("Select an active date");
      return;
    }
    setFormData((prev) => {
      const baseSlots = prev.timeSlots[activeDate] || [];
      const baseCatsByKey = new Map<string, TicketCategory[]>();
      baseSlots.forEach((s) => {
        baseCatsByKey.set(
          `${s.startTime}-${s.endTime}`,
          (s.seatCategories || []).map((c) => ({ ...c }))
        );
      });

      const next: MyFormData["timeSlots"] = { ...prev.timeSlots };
      prev.selectedDates.forEach((date) => {
        const dateSlots = next[date] || [];
        next[date] = dateSlots.map((slot) => {
          const cats = baseCatsByKey.get(`${slot.startTime}-${slot.endTime}`);
          return {
            ...slot,
            seatCategories: cats ? cats.map((c) => ({ ...c })) : [...(slot.seatCategories || [])],
          };
        });
      });

      return { ...prev, timeSlots: next };
    });
  
  };

  /* ---------- Popups state & handlers ---------- */
  const [showTimeSlotPopup, setShowTimeSlotPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [applyAllSlot, setApplyAllSlot] = useState<TimeSlotItem | null>(null);

  // Opens TimeSlotPopup prefilled from activeDate's first slot (or empty)
  const openApplyAllSlotPopup = () => {
    if (!activeDate) {
      toast.error("Select an active date");
      return;
    }
    const base = formData.timeSlots[activeDate]?.[0];
    setApplyAllSlot(
      base ?? { startTime: "10:00", endTime: "12:00", capacity: 0, duration: "2h 0m", seatCategories: [] }
    );
    setShowTimeSlotPopup(true);
  };

  // Update the temporary slot in popup (signature must match TimeSlotPopup)
  const updateApplyAllSlot = (field: string, value: string | number) => {
    setApplyAllSlot((prev) => {
      if (!prev) return prev as null;
      const next = { ...prev, [field]: value } as TimeSlotItem;
      if (field === "startTime" || field === "endTime") {
        next.duration = formatDuration(next.startTime, next.endTime);
      }
      return next;
    });
  };

  // Apply the popup slot to all selected dates
  const applySlotToAllDates = () => {
    if (!applyAllSlot) return;
    setFormData((prev) => {
      const next = { ...prev.timeSlots };
      prev.selectedDates.forEach((d) => {
        const slots = next[d] ? [...next[d]] : [];
        slots.push({
          startTime: applyAllSlot.startTime,
          endTime: applyAllSlot.endTime,
          capacity: applyAllSlot.capacity,
          duration: formatDuration(applyAllSlot.startTime, applyAllSlot.endTime),
          seatCategories: (applyAllSlot.seatCategories || []).map((c) => ({ ...c })),
        });
        next[d] = slots;
      });
      return { ...prev, timeSlots: next };
    });
    setShowTimeSlotPopup(false);
    setApplyAllSlot(null);

  };

  const [categoriesToApply, setCategoriesToApply] = useState<TicketCategory[]>([]);

  const openCategoryPopup = () => {
    if (!activeDate) {
      toast.error("Select an active date");
      return;
    }
    // Prefill with the first slot's categories if available
    const baseCats = formData.timeSlots[activeDate]?.[0]?.seatCategories || [];
    setCategoriesToApply(baseCats.map((c) => ({ ...c })));
    setShowCategoryPopup(true);
  };

  const applyCategoriesToAllSlots = () => {
    if (!activeDate) {
      toast.error("Select an active date");
      return;
    }
    // Overwrite activeDate categories with categoriesToApply, then propagate
    setFormData((prev) => {
      const slots = [...(prev.timeSlots[activeDate] || [])].map((s) => ({
        ...s,
        seatCategories: categoriesToApply.map((c) => ({ ...c })),
      }));
      return { ...prev, timeSlots: { ...prev.timeSlots, [activeDate]: slots } };
    });
    createApplyAllSlotsTemplate();
    setShowCategoryPopup(false);
  };

  /* ---------- Save ---------- */
  const handleSave = async () => {
    try {
      if (!eventId) {
        toast.error("Missing event_id");
        return;
      }
      if (!formData.selectedDates.length) {
        toast.error("Please select at least one date");
        return;
      }

      // If we know allowed dates from backend, validate now to avoid 400
      if (Array.isArray(allowedDates) && allowedDates.length > 0) {
        const invalid = formData.selectedDates.filter((d) => !allowedDates.includes(d));
        if (invalid.length) {
          toast.error(
            `Some selected dates are not in the event's schedule: ${invalid.join(", ")}`
          );
          return;
        }
      }

      // Only include slot_data for selected dates
      const slot_data: Record<string, any[]> = {};
      formData.selectedDates.forEach((date) => {
        const slots = formData.timeSlots[date] || [];
        slot_data[date] = slots.map((slot, idx) => ({
          time: formatTime24to12(slot.startTime),
          duration: formatDurationVerbose(slot.startTime, slot.endTime),
          seatCategories: (slot.seatCategories || []).map((cat, catIndex) => {
            const safeId =
              cat.id ||
              `${(cat.name || "cat").toLowerCase().replace(/\s+/g, "_")}_${slot.startTime.replace(":", "")}_${
                catIndex + 1
              }`;
            return {
              id: safeId,
              label: cat.name,
              price: Number(cat.price) || 0,
              totalTickets: Number(cat.quantity) || 0,
             
            };
          }),
        }));
      });

      const payload = {
        event_ref_id: eventId,
        event_dates: formData.selectedDates,
        slot_data,
      };

      await axiosInstance.put(`/new-slots/update?event_ref_id=${eventId}`, payload);
      toast.success("Dates & slots updated successfully");
      router.push(`/Events`);
    } catch (err: any) {
      console.error(err);
      const msg: string =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update slots";

      if (/must be one of event dates/i.test(msg)) {
        toast.error(msg);
      } else {
        toast.error("Failed to update slots");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Manage Dates &amp; Slots</CardTitle>
          {existingDates.length > 0 && (
            <div className="w-full">
              <div className="text-xs text-gray-600 mb-1">Already created dates (read-only)</div>
              <div className="flex flex-wrap gap-2">
                {existingDates.map((d) => (
                  <span key={d} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 border border-gray-200">
                    {new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Steps header */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`px-2 py-1 rounded ${step === 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Step 1: Dates & Slots</div>
            <span className="text-gray-400">→</span>
            <div className={`px-2 py-1 rounded ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Step 2: Categories & Pricing</div>
          </div>

          {/* Step content */}
          {step === 1 ? (
            <NewDateCreator
              formData={formData}
              activeDate={activeDate}
              setActiveDate={setActiveDate}
              toggleDateSelection={toggleDateSelection}
              getDatesBetween={getDatesBetween}
              addTimeSlot={addTimeSlot}
              updateTimeSlot={updateTimeSlot}
              removeTimeSlot={removeTimeSlot}
              openApplyAllSlotPopup={openApplyAllSlotPopup}
              allowedDates={allowedDates ?? undefined}
              existingDates={existingDates}
              monthLabel={monthLabel}
              onPrevMonth={onPrevMonth}
              onNextMonth={onNextMonth}
            />
          ) : (
            <NewCategoriesPricing
              formData={formData}
              activeDate={activeDate}
              setActiveDate={setActiveDate}
              toggleDateSelection={toggleDateSelection}
              getDatesBetween={getDatesBetween}
              addTicketCategoryToSlot={addTicketCategoryToSlot}
              updateTicketCategoryInSlot={updateTicketCategoryInSlot}
              removeTicketCategoryFromSlot={removeTicketCategoryFromSlot}
              openApplyAllCategoriesPopup={openCategoryPopup}
              createApplyAllTemplate={createApplyAllSlotsTemplate}
            />
          )}

          {/* Step navigation */}
          <div className="mt-2 flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>Back</Button>
            {step === 1 ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={
                    formData.selectedDates.length === 0 ||
                    formData.selectedDates.every((d) => (formData.timeSlots[d] || []).length === 0)
                  }
                  title={
                    formData.selectedDates.length === 0
                      ? "Select at least one date"
                      : formData.selectedDates.every((d) => (formData.timeSlots[d] || []).length === 0)
                        ? "Add at least one time slot before proceeding"
                        : undefined
                  }
                >
                  Next: Categories & Pricing
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep(1)}>Back to Dates & Slots</Button>
                <Button onClick={handleSave}>Save All</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Apply a slot to all selected dates */}
      {showTimeSlotPopup && applyAllSlot && (
        <TimeSlotPopup
          applyAllSlot={applyAllSlot}
          setApplyAllSlot={setApplyAllSlot}
          applyToAllDates={applySlotToAllDates}
          updateApplyAllSlot={updateApplyAllSlot}
          setShowApplyAll={(show) => {
            setShowTimeSlotPopup(show);
            if (!show) setApplyAllSlot(null);
          }}
        />
      )}

      {/* Apply categories to all slots */}
      {showCategoryPopup && (
        <CategoryPricingPopup
          categories={categoriesToApply}
          setCategories={setCategoriesToApply}
          applyToAllSlots={applyCategoriesToAllSlots}
          setShowApplyAll={setShowCategoryPopup}
        />
      )}
    </div>
  );
}