"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Clock } from "lucide-react"
import type { SeatCategory, TimeSlot } from "./event-organizer"

interface UnifiedSlotManagerProps {
  selectedDates: string[]
  slots: Record<string, TimeSlot[]>
  onAddTimeSlot: (date: string) => void
  onUpdateTimeSlot: (date: string, slotId: string, field: keyof TimeSlot, value: any) => void
  onDeleteTimeSlot: (date: string, slotId: string) => void
  onUpdateSlotSeatCategory: (
    date: string,
    slotId: string,
    categoryIndex: number,
    field: keyof SeatCategory,
    value: any,
  ) => void
  onAddSlotSeatCategory: (date: string, slotId: string) => void
  onDeleteSlotSeatCategory: (date: string, slotId: string, categoryIndex: number) => void
  onAddSlotToAllDates: (slotData?: Omit<TimeSlot, "id">) => void
}


export function validateTimeFormat(time: string): boolean {
  // HH:MM AM/PM (with space only)
  const regex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i;
  return regex.test(time.trim());
}

// ✅ Matches "2 hours", "1 hour", "30 minutes", "1 hour 20 minutes"
export function validateDurationFormat(duration: string): boolean {
  const regex =
    /^((\d+)\s+hours?(\s+(\d+)\s+minutes?)?|(\d+)\s+minutes?)$/i
  return regex.test(duration.trim())
}
export function UnifiedSlotManager({
  selectedDates,
  slots,
  onAddTimeSlot,
  onUpdateTimeSlot,
  onDeleteTimeSlot,
  onUpdateSlotSeatCategory,
  onAddSlotSeatCategory,
  onDeleteSlotSeatCategory,
  onAddSlotToAllDates,
}: UnifiedSlotManagerProps) {
  const [bulkSlots, setBulkSlots] = useState([
    {
      id: `bulk-${Date.now()}`,
      time: "10:00 AM",
      duration: "2 hours",
      seatCategories: [
        { id: "platinum", label: "Platinum", price: 150, totalTickets: 50 },
        { id: "diamond", label: "Diamond", price: 120, totalTickets: 100 },
        { id: "gold", label: "Gold", price: 80, totalTickets: 200 },
        { id: "silver", label: "Silver", price: 50, totalTickets: 300 },
      ],
    },
  ])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const getSeatCategoryColor = (categoryId: string): string => {
    const colors = {
      platinum: "bg-purple-50 text-purple-700 border-purple-200",
      diamond: "bg-blue-50 text-blue-700 border-blue-200",
      gold: "bg-amber-50 text-amber-700 border-amber-200",
      silver: "bg-slate-50 text-slate-700 border-slate-200",
    }
    return colors[categoryId as keyof typeof colors] || "bg-slate-50 text-slate-700 border-slate-200"
  }

  const handleBulkSlotsCreate = () => {

          for (const slotData of bulkSlots) {
    if (!validateTimeFormat(slotData.time)) {
      toast.error(`Invalid time format: ${slotData.time}. Please use HH:MM AM/PM (e.g., 10:00 AM)`)
      return
    }
    if (!validateDurationFormat(slotData.duration)) {
      toast.error(
        `Invalid duration format: ${slotData.duration}. Please use "X hours", "Y minutes", or "X hours Y minutes"`
      )
      return
    }
  }
    bulkSlots.forEach((slotData) => {
      const { id, ...slotWithoutId } = slotData
      onAddSlotToAllDates(slotWithoutId)
    })
    // Reset to single slot after creation
    setBulkSlots([
      {
        id: `bulk-${Date.now()}`,
        time: "10:00 AM",
        duration: "2 hours",
        seatCategories: [
          { id: "platinum", label: "Platinum", price: 150, totalTickets: 50 },
          { id: "diamond", label: "Diamond", price: 120, totalTickets: 100 },
          { id: "gold", label: "Gold", price: 80, totalTickets: 200 },
          { id: "silver", label: "Silver", price: 50, totalTickets: 300 },
        ],
      },
    ])
  }

  const addBulkSlot = () => {
    setBulkSlots((prev) => [
      ...prev,
      {
        id: `bulk-${Date.now()}`,
        time: "10:00 AM",
        duration: "2 hours",
        seatCategories: [
          { id: "platinum", label: "Platinum", price: 150, totalTickets: 50 },
          { id: "diamond", label: "Diamond", price: 120, totalTickets: 100 },
          { id: "gold", label: "Gold", price: 80, totalTickets: 200 },
          { id: "silver", label: "Silver", price: 50, totalTickets: 300 },
        ],
      },
    ])
  }

  const deleteBulkSlot = (slotId: string) => {
    setBulkSlots((prev) => prev.filter((slot) => slot.id !== slotId))
  }

  const updateBulkSlot = (slotId: string, field: string, value: any) => {
    setBulkSlots((prev) => prev.map((slot) => (slot.id === slotId ? { ...slot, [field]: value } : slot)))
  }

  const updateBulkSeatCategory = (slotId: string, categoryIndex: number, field: keyof SeatCategory, value: any) => {
    setBulkSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              seatCategories: slot.seatCategories.map((cat, i) =>
                i === categoryIndex ? { ...cat, [field]: value } : cat,
              ),
            }
          : slot,
      ),
    )
  }

  const addBulkSeatCategory = (slotId: string) => {
    setBulkSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              seatCategories: [
                ...slot.seatCategories,
                { id: `category-${Date.now()}`, label: "New Category", price: 0, totalTickets: 0 },
              ],
            }
          : slot,
      ),
    )
  }

  const deleteBulkSeatCategory = (slotId: string, categoryIndex: number) => {
    setBulkSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              seatCategories: slot.seatCategories.filter((_, i) => i !== categoryIndex),
            }
          : slot,
      ),
    )
  }

  const isMultipleDates = selectedDates.length > 1

  return (
    <div className="space-y-6">
      {isMultipleDates && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Create Slots for All Dates</h4>
              <p className="text-sm text-blue-700">
                Add {bulkSlots.length} slot{bulkSlots.length !== 1 ? "s" : ""} to all {selectedDates.length} selected
                dates
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={addBulkSlot} size="sm" variant="outline" className="bg-white">
                <Plus className="w-3 h-3 mr-1" />
                Add Another Slot
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {bulkSlots.map((bulkSlot, slotIndex) => (
              <Card key={bulkSlot.id} className="bg-white">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900">Slot #{slotIndex + 1}</h4>
                    {bulkSlots.length > 1 && (
                      <Button
                        onClick={() => deleteBulkSlot(bulkSlot.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`bulk-time-${bulkSlot.id}`}>Time</Label>
                      <Input
                        id={`bulk-time-${bulkSlot.id}`}
                        value={bulkSlot.time}
                        onChange={(e) => updateBulkSlot(bulkSlot.id, "time", e.target.value)}
                        placeholder="e.g., 10:00 AM"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`bulk-duration-${bulkSlot.id}`}>Duration</Label>
                      <Input
                        id={`bulk-duration-${bulkSlot.id}`}
                        value={bulkSlot.duration}
                        onChange={(e) => updateBulkSlot(bulkSlot.id, "duration", e.target.value)}
                        placeholder="e.g., 2 hours"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Seat Categories</Label>
                      <Button onClick={() => addBulkSeatCategory(bulkSlot.id)} size="sm" variant="outline">
                        <Plus className="w-3 h-3 mr-1" />
                        Add Category
                      </Button>
                    </div>

                    {bulkSlot.seatCategories.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="grid grid-cols-4 gap-2 items-end">
                        <div>
                          <Label className="text-xs">Category</Label>
                          <Input
                            value={category.label}
                            onChange={(e) =>
                              updateBulkSeatCategory(bulkSlot.id, categoryIndex, "label", e.target.value)
                            }
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Price ($)</Label>
                          <Input
                            type="number"
                            value={category.price}
                            onChange={(e) =>
                              updateBulkSeatCategory(bulkSlot.id, categoryIndex, "price", Number(e.target.value))
                            }
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Tickets</Label>
                          <Input
                            type="number"
                            value={category.totalTickets}
                            onChange={(e) =>
                              updateBulkSeatCategory(bulkSlot.id, categoryIndex, "totalTickets", Number(e.target.value))
                            }
                            className="text-sm"
                          />
                        </div>
                        <Button
                          onClick={() => deleteBulkSeatCategory(bulkSlot.id, categoryIndex)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleBulkSlotsCreate} size="sm" className="bg-blue-600 hover:bg-blue-700">
                Create {bulkSlots.length} Slot{bulkSlots.length !== 1 ? "s" : ""} for All Dates
              </Button>
            </div>
          </div>
        </div>
      )}

      {isMultipleDates && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-3">Slots Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedDates.map((dateStr) => {
              const dateSlots = slots[dateStr] || []
              return (
                <div key={dateStr} className="bg-white rounded-lg p-3 border">
                  <div className="text-sm font-medium text-slate-900">{formatDate(dateStr)}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {dateSlots.length} slot{dateSlots.length !== 1 ? "s" : ""}
                  </div>
                  {dateSlots.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {dateSlots.map((slot, index) => (
                        <div key={slot.id} className="text-xs text-slate-500">
                          {slot.time} ({slot.duration})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!isMultipleDates &&
        selectedDates.map((dateStr) => {
          const dateSlots = slots[dateStr] || []
          return (
            <Card key={dateStr} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDate(dateStr)}
                    <Badge variant="outline" className="ml-2">
                      {dateSlots.length} slot{dateSlots.length !== 1 ? "s" : ""}
                    </Badge>
                  </CardTitle>
                  <Button onClick={() => onAddTimeSlot(dateStr)} size="sm" variant="outline">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Slot
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {dateSlots.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No time slots created yet</p>
                    <p className="text-xs opacity-75">Click 'Add Slot' to create your first time slot</p>
                  </div>
                ) : (
                  dateSlots.map((slot, slotIndex) => (
                    <Card key={slot.id} className="bg-slate-50">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-900">Slot #{slotIndex + 1}</h4>
                          <Button
                            onClick={() => onDeleteTimeSlot(dateStr, slot.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`time-${slot.id}`}>Time</Label>
                            <Input
                              id={`time-${slot.id}`}
                              value={slot.time}
                              onChange={(e) => onUpdateTimeSlot(dateStr, slot.id, "time", e.target.value)}
                              placeholder="e.g., 10:00 AM"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`duration-${slot.id}`}>Duration</Label>
                            <Input
                              id={`duration-${slot.id}`}
                              value={slot.duration}
                              onChange={(e) => onUpdateTimeSlot(dateStr, slot.id, "duration", e.target.value)}
                              placeholder="e.g., 2 hours"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Seat Categories</Label>
                            <Button onClick={() => onAddSlotSeatCategory(dateStr, slot.id)} size="sm" variant="outline">
                              <Plus className="w-3 h-3 mr-1" />
                              Add Category
                            </Button>
                          </div>

                          {slot.seatCategories.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="grid grid-cols-4 gap-2 items-end">
                              <div>
                                <Label className="text-xs">Category</Label>
                                <Input
                                  value={category.label}
                                  onChange={(e) =>
                                    onUpdateSlotSeatCategory(dateStr, slot.id, categoryIndex, "label", e.target.value)
                                  }
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Price ($)</Label>
                                <Input
                                  type="number"
                                  value={category.price}
                                  onChange={(e) =>
                                    onUpdateSlotSeatCategory(
                                      dateStr,
                                      slot.id,
                                      categoryIndex,
                                      "price",
                                      Number(e.target.value),
                                    )
                                  }
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Tickets</Label>
                                <Input
                                  type="number"
                                  value={category.totalTickets}
                                  onChange={(e) =>
                                    onUpdateSlotSeatCategory(
                                      dateStr,
                                      slot.id,
                                      categoryIndex,
                                      "totalTickets",
                                      Number(e.target.value),
                                    )
                                  }
                                  className="text-sm"
                                />
                              </div>
                              <Button
                                onClick={() => onDeleteSlotSeatCategory(dateStr, slot.id, categoryIndex)}
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}

                          <div className="flex flex-wrap gap-2 pt-2">
                            {slot.seatCategories.map((category, index) => (
                              <Badge key={index} className={getSeatCategoryColor(category.id)}>
                                {category.label}: ${category.price} ({category.totalTickets} tickets)
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          )
        })}
    </div>
  )
}
