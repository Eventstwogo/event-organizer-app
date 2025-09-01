"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import type { EventItem } from "@/lib/data/events"
import { formatCurrency } from "./money"

export function EventDetailsSheet({
  open,
  onOpenChange,
  event,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  event: EventItem | null
}) {
  const subtotal = event ? formatCurrency(event.attendees * event.pricePerAttendee) : formatCurrency(0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-md">
        <SheetHeader>
          <SheetTitle className="text-balance">Event Details</SheetTitle>
          <SheetDescription>Review the details for the selected event.</SheetDescription>
        </SheetHeader>

        {!event ? (
          <p className="mt-4 text-sm text-muted-foreground">No event selected.</p>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Event</p>
              <p className="font-medium">{event.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Organizer</p>
                <p className="font-medium">{event.organizer || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-medium">{event.reference || event.id}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Attendees</p>
                <p className="font-medium">{event.attendees}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price per Attendee</p>
                <p className="font-medium">{formatCurrency(event.pricePerAttendee)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tax Rate</p>
                <p className="font-medium">{Math.round(event.taxRate * 100)}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Potential Subtotal</p>
                <p className="text-base font-semibold">{subtotal}</p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
