import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

interface DateSelectionProps {
  formData: MyFormData
  activeDate: string
  setActiveDate: (date: string) => void
  toggleDateSelection: (date: string) => void
  getDatesBetween: (startDate: string, endDate: string) => string[]
  addTimeSlot: (date: string) => void
  updateTimeSlot: (date: string, index: number, field: string, value: string | number) => void
  removeTimeSlot: (date: string, index: number) => void
  createApplyAllTemplate: () => void
}

export default function DateSelection({
  formData,
  activeDate,
  setActiveDate,
  toggleDateSelection,
  getDatesBetween,
  addTimeSlot,
  updateTimeSlot,
  removeTimeSlot,
  createApplyAllTemplate,
}: DateSelectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 h-full">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Dates & Create Time Slots</h3>
        <p className="text-gray-600">Choose dates and create time slots for your event</p>
      </div>
      {formData.startDate && formData.endDate ? (
        <div className="flex gap-6 h-[600px]">
          <div className="w-80 bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Dates</h4>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const dates = getDatesBetween(formData.startDate, formData.endDate)
                const startDate = new Date(dates[0])
                const startDay = startDate.getDay()
                const calendarDates = []

                for (let i = 0; i < startDay; i++) {
                  calendarDates.push(<div key={`empty-${i}`} className="h-8"></div>)
                }

                dates.forEach((date) => {
                  const isSelected = formData.selectedDates.includes(date)
                  const dateObj = new Date(date)
                  const dayNumber = dateObj.getDate()

                  calendarDates.push(
                    <div
                      key={date}
                      onClick={() => toggleDateSelection(date)}
                      className={`h-8 flex items-center justify-center rounded cursor-pointer transition-all duration-200 text-xs ${
                        isSelected ? "bg-blue-500 text-white" : "hover:bg-blue-50 text-gray-700"
                      }`}
                    >
                      {dayNumber}
                    </div>,
                  )
                })

                return calendarDates
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
          <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Time Slots</h4>
              {formData.selectedDates.length > 1 && (
                <Button
                  type="button"
                  onClick={createApplyAllTemplate}
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                >
                  Apply to All Dates
                </Button>
              )}
            </div>
            {formData.selectedDates.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg mb-2">No dates selected</div>
                <div className="text-sm">Select dates from the calendar to create time slots</div>
              </div>
            ) : (
              <div className="space-y-4">
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
                {activeDate && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">
                        {new Date(activeDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </h5>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(activeDate)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        Add Time Slot
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(formData.timeSlots[activeDate] || []).map((slot, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-gray-700">Start Time</Label>
                                <Input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) =>
                                    updateTimeSlot(activeDate, index, "startTime", e.target.value)
                                  }
                                  className="h-9 w-30"
                                />
                              </div>
                              <span className="text-gray-400 text-sm mt-6">to</span>
                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-gray-700">End Time</Label>
                                <Input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) =>
                                    updateTimeSlot(activeDate, index, "endTime", e.target.value)
                                  }
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Please set start and end dates in the Event Details step first.</p>
        </div>
      )}
    </div>
  )
}