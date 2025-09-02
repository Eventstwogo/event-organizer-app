

import { useState,useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TimeSlot {
  startTime: string
  endTime: string
  capacity: number
  duration: string
  seatCategories: TicketCategory[]
}

interface TicketCategory {
  id: string
  name: string
  price: number
  quantity: number
}

interface MyFormData {
  startDate: string
  endDate: string
  selectedDates: string[]
  timeSlots: { [date: string]: TimeSlot[] }
}

interface TimeSlotsProps {
  formData: MyFormData
  activeDate: string
  setActiveDate: (date: string) => void
  toggleDateSelection: (date: string) => void
  getDatesBetween: (startDate: string, endDate: string) => string[]
  addTicketCategoryToSlot: (date: string, slotIndex: number) => void
  updateTicketCategoryInSlot: (
    date: string,
    slotIndex: number,
    categoryId: string,
    field: keyof TicketCategory,
    value: string | number
  ) => void
  removeTicketCategoryFromSlot: (date: string, slotIndex: number, categoryId: string) => void
  createApplyAllTemplate: () => void
}

export default function TimeSlots({
  formData,
  activeDate,
  setActiveDate,
  toggleDateSelection,
  getDatesBetween,
  addTicketCategoryToSlot,
  updateTicketCategoryInSlot,
  removeTicketCategoryFromSlot,
  createApplyAllTemplate,
}: TimeSlotsProps) {
  // 👇 Track month/year for navigation
  const monthStartOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
  const toISODate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  const parseISODateLocal = (iso: string) => {
    if (!iso) return new Date()
    const [y, m, d] = iso.split("-").map(Number)
    return new Date(y, (m || 1) - 1, d || 1) // Local time, avoids UTC shift
  }

  const minDateLocal = useMemo(() => parseISODateLocal(formData.startDate), [formData.startDate])
  const maxDateLocal = useMemo(() => parseISODateLocal(formData.endDate), [formData.endDate])

  const [currentMonth, setCurrentMonth] = useState<Date>(monthStartOf(parseISODateLocal(formData.startDate)))

  // Keep currentMonth in sync if startDate changes
  useEffect(() => {
    if (formData.startDate) {
      setCurrentMonth(monthStartOf(parseISODateLocal(formData.startDate)))
    }
  }, [formData.startDate])

  const isPrevDisabled = monthStartOf(currentMonth) <= monthStartOf(minDateLocal)
  const isNextDisabled = monthStartOf(currentMonth) >= monthStartOf(maxDateLocal)

  const handlePrevMonth = () => {
    if (!isPrevDisabled) {
      setCurrentMonth((prev) => monthStartOf(new Date(prev.getFullYear(), prev.getMonth() - 1, 1)))
    }
  }
  const handleNextMonth = () => {
    if (!isNextDisabled) {
      setCurrentMonth((prev) => monthStartOf(new Date(prev.getFullYear(), prev.getMonth() + 1, 1)))
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 h-full overflow-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Categories & Pricing</h3>
        <p className="text-gray-600">Set ticket categories and pricing for your time slots</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
        {/* Calendar */}
      <div className="w-80 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              disabled={isPrevDisabled}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h4 className="text-sm font-medium text-gray-900">
              {currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              disabled={isNextDisabled}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar dates */}
          <div className="grid grid-cols-7 gap-1">
            {(() => {
              const cells: JSX.Element[] = []
              const firstOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
              const lastOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
              const startDay = firstOfMonth.getDay()
              const daysInMonth = lastOfMonth.getDate()

              // pad before 1st
              for (let i = 0; i < startDay; i++) {
                cells.push(<div key={`empty-${i}`} className="h-8" />)
              }

              for (let d = 1; d <= daysInMonth; d++) {
                const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d)
                const iso = toISODate(dateObj)
                const isWithinRange = dateObj >= minDateLocal && dateObj <= maxDateLocal
                const isSelected = formData.selectedDates.includes(iso)

                cells.push(
                  <div
                    key={iso}
                    onClick={() => isWithinRange && toggleDateSelection(iso)}
                    className={`h-8 flex items-center justify-center rounded text-xs transition-all duration-200 ${
                      isWithinRange
                        ? isSelected
                          ? "bg-blue-500 text-white cursor-pointer"
                          : "text-gray-700 hover:bg-blue-50 cursor-pointer"
                        : "text-gray-300 cursor-default"
                    }`}
                  >
                    {d}
                  </div>,
                )
              }
              return cells
            })()}
          </div>

          {formData.selectedDates.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-2">
                {formData.selectedDates.length} date{formData.selectedDates.length > 1 ? "s" : ""} selected
              </div>
              <div className="text-xs text-blue-700">Click on dates to select/deselect</div>
            </div>
          )}
        </div>

        {/* Categories & Pricing Panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Categories And Pricing</h4>
            {formData.selectedDates?.length > 1 && (
              <Button
                type="button"
                onClick={createApplyAllTemplate}
                variant="outline"
                size="sm"
                className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
              >
                Apply to All Slots
              </Button>
            )}
          </div>

          {formData.selectedDates?.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg mb-2">No dates selected</div>
              <div className="text-sm">Select dates from the calendar to set categories and pricing</div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex flex-wrap gap-1 border-b border-gray-200">
                {formData.selectedDates.map((date) => {
                  const dateObj = new Date(date)
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                  const isActive = activeDate === date

                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setActiveDate(date)}
                      className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                        isActive
                          ? "bg-blue-500 text-white border-b-2 border-blue-500"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {formattedDate}
                      {formData.timeSlots[date]?.length > 0 && (
                        <span className="ml-1 text-xs bg-white bg-opacity-20 px-1 rounded">
                          {formData.timeSlots[date].length}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Active date details */}
              {activeDate && (
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">
                    {new Date(activeDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h5>

                  <div className="space-y-3">
                    {(formData.timeSlots[activeDate] || []).map((slot, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-medium text-gray-700">
                            {slot.startTime} - {slot.endTime}
                            <div className="text-xs text-gray-500">{slot.duration}</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h6 className="text-sm font-medium text-gray-800">Ticket Categories</h6>
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

                          {slot.seatCategories?.length === 0 ? (
                            <div className="text-center py-3 text-gray-500 text-sm">
                              No ticket categories added. Click "Add Category" to get started.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {slot.seatCategories?.map((category) => (
                                <div
                                  key={category.id}
                                  className="grid grid-cols-4 gap-3 items-center p-3 bg-white rounded border"
                                >
                                  <div className="space-y-1">
                                    <Label className="text-xs font-medium text-gray-700">Category Name</Label>
                                    <Input
                                      type="text"
                                      value={category.name}
                                      onChange={(e) =>
                                        updateTicketCategoryInSlot(activeDate, index, category.id, "name", e.target.value)
                                      }
                                      className="h-8"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs font-medium text-gray-700">Price ($)</Label>
                                    <Input
                                      type="text"
                                      value={category.price}
                                      onChange={(e) =>
                                        updateTicketCategoryInSlot(
                                          activeDate,
                                          index,
                                          category.id,
                                          "price",
                                          e.target.value
                                        )
                                      }
                                      className="h-8"
                                      min="0"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs font-medium text-gray-700">Quantity</Label>
                                    <Input
                                      type="text"
                                      value={category.quantity}
                                      onChange={(e) =>
                                        updateTicketCategoryInSlot(
                                          activeDate,
                                          index,
                                          category.id,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                      className="h-8"
                                      min="0"
                                    />
                                  </div>
                                  <div className="flex items-end justify-between">
                                    <div className="text-xs text-gray-600">
                                      Revenue: ${(category.price * category.quantity).toLocaleString()}
                                    </div>
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        removeTicketCategoryFromSlot(activeDate, index, category.id)
                                      }
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                    >
                                      ×
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {slot.seatCategories.length > 0 && (
                            <div className="text-sm font-medium text-gray-700 bg-blue-50 p-2 rounded">
                              Total Slot Revenue: $
                              {slot.seatCategories
                                .reduce((sum, cat) => sum + cat.price * cat.quantity, 0)
                                .toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {(!formData.timeSlots[activeDate] || formData.timeSlots[activeDate].length === 0) && (
                      <div className="text-center py-4 text-gray-500">No time slots created for this date.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
