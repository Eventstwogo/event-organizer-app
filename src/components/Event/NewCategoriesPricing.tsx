import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface NewCategoriesPricingProps {
  formData: MyFormData;
  activeDate: string;
  setActiveDate: (date: string) => void;
  toggleDateSelection: (date: string) => void;
  getDatesBetween: (startDate: string, endDate: string) => string[];
  addTicketCategoryToSlot: (date: string, slotIndex: number) => void;
  updateTicketCategoryInSlot: (
    date: string,
    slotIndex: number,
    categoryId: string,
    field: keyof TicketCategory,
    value: string | number
  ) => void;
  removeTicketCategoryFromSlot: (date: string, slotIndex: number, categoryId: string) => void;
  // Apply categories to all slots across selected dates via popup (preferred)
  openApplyAllCategoriesPopup?: () => void;
  // Fallback: directly apply categories template via function
  createApplyAllTemplate?: () => void;
}

export default function NewCategoriesPricing({
  formData,
  activeDate,
  setActiveDate,
  toggleDateSelection,
  getDatesBetween,
  addTicketCategoryToSlot,
  updateTicketCategoryInSlot,
  removeTicketCategoryFromSlot,
  openApplyAllCategoriesPopup,
  createApplyAllTemplate,
}: NewCategoriesPricingProps) {
  const dates = formData.startDate && formData.endDate
    ? getDatesBetween(formData.startDate, formData.endDate)
    : [];

  const handleApplyAll = () => {
    if (openApplyAllCategoriesPopup) return openApplyAllCategoriesPopup();
    if (createApplyAllTemplate) return createApplyAllTemplate();
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Categories & Pricing</h3>
          <p className="text-gray-600 text-sm">Manage ticket categories and pricing for each time slot</p>
        </div>
        {formData.selectedDates?.length > 1 && (
          <Button
            type="button"
            onClick={handleApplyAll}
            variant="outline"
            size="sm"
            className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
          >
            Apply to All Slots
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[640px]">
        {/* Date selector (calendar-like grid for the current range) */}
        <div className="w-full lg:w-80 bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Dates</h4>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
              <div key={idx} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

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
                const dayNum = new Date(d).getDate();

                items.push(
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDateSelection(d)}
                    className={`h-8 flex items-center justify-center rounded text-xs transition-all duration-200 border
                      cursor-pointer
                      ${isSelected ? "bg-blue-500 text-white border-blue-500" : "hover:bg-blue-50 text-gray-700 border-transparent"}
                    `}
                  >
                    {dayNum}
                  </button>
                );
              });

              return items;
            })()}
          </div>

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

        {/* Categories & pricing editor */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 overflow-auto">
          {!activeDate || formData.selectedDates.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <div className="text-sm">Select a date that has time slots to manage categories and pricing.</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h5 className="font-medium text-gray-900">
                  {new Date(activeDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </h5>
              </div>

              {(formData.timeSlots[activeDate] || []).map((slot, index) => {
                const slotRevenue = (slot.seatCategories || []).reduce((sum, c) => sum + (c.price || 0) * (c.quantity || 0), 0);
                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-gray-700">
                        {slot.startTime} - {slot.endTime}
                        <div className="text-xs text-gray-500">{slot.duration}</div>
                      </div>
                      <div className="text-sm font-semibold text-gray-700">Slot Revenue: ${slotRevenue.toLocaleString()}</div>
                    </div>

                    {/* Categories list */}
                    <div className="space-y-2">
                      {(slot.seatCategories || []).length === 0 && (
                        <div className="text-center py-3 text-gray-500 text-sm">
                          No categories yet. Add your first ticket category.
                        </div>
                      )}

                      {slot.seatCategories?.map((category) => (
                        <div key={category.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center p-3 bg-white rounded border">
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">Category Name</Label>
                            <Input
                              type="text"
                              value={category.name}
                              onChange={(e) => updateTicketCategoryInSlot(activeDate, index, category.id, "name", e.target.value)}
                              className="h-9"
                              placeholder="e.g., VIP, General"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">Price ($)</Label>
                            <Input
                              type="number"
                              value={category.price}
                              onChange={(e) => updateTicketCategoryInSlot(activeDate, index, category.id, "price", Number(e.target.value) || 0)}
                              className="h-9"
                              min={0}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">Quantity</Label>
                            <Input
                              type="number"
                              value={category.quantity}
                              onChange={(e) => updateTicketCategoryInSlot(activeDate, index, category.id, "quantity", Number(e.target.value) || 0)}
                              className="h-9"
                              min={0}
                            />
                          </div>
                          <div className="flex items-end justify-between gap-3">
                            <div className="text-xs text-gray-600">
                              Revenue: ${(category.price * category.quantity).toLocaleString()}
                            </div>
                            <Button
                              type="button"
                              onClick={() => removeTicketCategoryFromSlot(activeDate, index, category.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 h-8 px-2"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <Button
                        type="button"
                        onClick={() => addTicketCategoryToSlot(activeDate, index)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        + Add Category
                      </Button>
                    </div>
                  </div>
                );
              })}

              {(!formData.timeSlots[activeDate] || formData.timeSlots[activeDate].length === 0) && (
                <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                  No time slots created for this date. Add time slots first.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}