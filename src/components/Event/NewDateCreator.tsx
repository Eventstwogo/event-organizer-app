import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

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
  timeSlots: { [date: string]: TimeSlotItem[] };
}

interface NewDateCreatorProps {
  formData: MyFormData;
  activeDate: string;
  setActiveDate: (date: string) => void;
  toggleDateSelection: (date: string) => void;
  getDatesBetween: (startDate: string, endDate: string) => string[];
  addTimeSlot: (date: string) => void;
  updateTimeSlot: (date: string, index: number, field: string, value: string | number) => void;
  removeTimeSlot: (date: string, index: number) => void;
  openApplyAllSlotPopup: () => void; // opens TimeSlot popup (time + duration only)
  allowedDates?: string[]; // optional list of selectable dates (YYYY-MM-DD)
  existingDates?: string[]; // dates already created (read-only)
  monthLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const isDateAllowed = (date: string, allowed?: string[]) => {
  if (!allowed || allowed.length === 0) return true;
  return allowed.includes(date);
};

export default function NewDateCreator({
  formData,
  activeDate,
  setActiveDate,
  toggleDateSelection,
  getDatesBetween,
  addTimeSlot,
  updateTimeSlot,
  removeTimeSlot,
  openApplyAllSlotPopup,
  allowedDates,
  existingDates,
  monthLabel,
  onPrevMonth,
  onNextMonth,
}: NewDateCreatorProps) {
  const dates = formData.startDate && formData.endDate
    ? getDatesBetween(formData.startDate, formData.endDate)
    : [];

  // Helpers to avoid timezone issues and block past dates
  const parseISODateLocal = (iso: string) => {
    if (!iso) return new Date();
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };
  const now = new Date();
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Create Event Dates</h3>
          <p className="text-gray-600 text-sm">Pick multiple dates and manage time slots</p>
        </div>
        {formData.selectedDates.length > 1 && (
          <Button
            type="button"
            onClick={openApplyAllSlotPopup}
            variant="outline"
            size="sm"
            className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
          >
            Apply to All Dates
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[640px]">
        {/* Calendar panel */}
        <div className="w-full lg:w-80 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={onPrevMonth}
              className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
              aria-label="Previous month"
            >
              ◀
            </button>
            <h4 className="text-lg font-semibold text-gray-900">{monthLabel}</h4>
            <button
              type="button"
              onClick={onNextMonth}
              className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
              aria-label="Next month"
            >
              ▶
            </button>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
              <div key={idx} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {(() => {
              if (!dates.length) return null;
              const startDate = new Date(dates[0]);
              const startDay = startDate.getDay();
              const items: JSX.Element[] = [];

              for (let i = 0; i < startDay; i++) {
                items.push(<div key={`empty-${i}`} className="h-8" />);
              }

              dates.forEach((d) => {
                const isSelected = formData.selectedDates.includes(d);
                const allowedByProp = isDateAllowed(d, allowedDates);
                const isExisting = (existingDates || []).includes(d);
                const localDate = parseISODateLocal(d);
                const isInPast = localDate < todayLocal;
                const allowed = allowedByProp && !isInPast; // block past dates
                const dayNum = localDate.getDate();

                items.push(
                  <button
                    key={d}
                    type="button"
                    onClick={() => allowed && !isExisting && toggleDateSelection(d)}
                    className={`h-8 flex items-center justify-center rounded text-xs transition-all duration-200 border
                      ${allowed && !isExisting ? "cursor-pointer" : "cursor-not-allowed opacity-40"}
                      ${isExisting ? "bg-gray-200 text-gray-500 border-gray-300" : isSelected ? "bg-blue-500 text-white border-blue-500" : "hover:bg-blue-50 text-gray-700 border-transparent"}
                    `}
                    aria-disabled={!allowed || isExisting}
                    title={isExisting ? "Already created" : isInPast ? "Past date not allowed" : undefined}
                  >
                    {dayNum}
                  </button>
                );
              });

              return items;
            })()}
          </div>

          {/* Selected dates quick view */}
          {formData.selectedDates.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium text-blue-900">
                {formData.selectedDates.length} date{formData.selectedDates.length > 1 ? "s" : ""} selected
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.selectedDates.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`px-2 py-1 text-xs rounded border ${activeDate === d ? "bg-blue-500 text-white border-blue-500" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                    onClick={() => setActiveDate(d)}
                  >
                    {new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Time slots panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-900">Time Slots</h4>
            {activeDate && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTimeSlot(activeDate)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Add Time Slot
              </Button>
            )}
          </div>

          {!activeDate || formData.selectedDates.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <div className="text-sm">Select one or more dates to manage time slots.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {(formData.timeSlots[activeDate] || []).map((slot, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-700">Start Time</Label>
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateTimeSlot(activeDate, index, "startTime", e.target.value)}
                          className="h-9 w-30"
                        />
                      </div>
                      <span className="text-gray-400 text-sm mt-6">to</span>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-700">End Time</Label>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateTimeSlot(activeDate, index, "endTime", e.target.value)}
                          className="h-9 w-30"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-700">Duration</Label>
                      <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded border h-9 flex items-center min-w-[80px]">
                        {slot.duration || "0h 0m"}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTimeSlot(activeDate, index)}
                    className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {(!formData.timeSlots[activeDate] || formData.timeSlots[activeDate].length === 0) && (
                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                  No time slots yet. Click "Add Time Slot" to create one.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}