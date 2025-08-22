import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface TimeSlot {
  startTime: string
  endTime: string
  capacity: number
  duration: string
}

interface TimeSlotPopupProps {
  applyAllSlot: TimeSlot | null
  setApplyAllSlot: (slot: TimeSlot | null) => void
  applyToAllDates: () => void
  updateApplyAllSlot: (field: string, value: string | number) => void
  setShowApplyAll: (show: boolean) => void
}

export function TimeSlotPopup({
  applyAllSlot,
  setApplyAllSlot,
  applyToAllDates,
  updateApplyAllSlot,
  setShowApplyAll,
}: TimeSlotPopupProps) {
  if (!applyAllSlot) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Apply Slot to All Dates</h3>
          <Button
            type="button"
            onClick={() => setShowApplyAll(false)}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Start Time</Label>
              <Input
                type="time"
                value={applyAllSlot.startTime}
                onChange={(e) => updateApplyAllSlot("startTime", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">End Time</Label>
              <Input
                type="time"
                value={applyAllSlot.endTime}
                onChange={(e) => updateApplyAllSlot("endTime", e.target.value)}
              />
            </div>
           
          </div>

          {applyAllSlot.duration && (
            <div className="text-xs text-green-700">Duration: {applyAllSlot.duration}</div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" onClick={() => setShowApplyAll(false)} variant="outline">
              Cancel
            </Button>
            <Button type="button" onClick={applyToAllDates} className="bg-green-600 hover:bg-green-700">
              Apply to All Selected Dates
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}