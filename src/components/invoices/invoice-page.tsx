"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EventsTable } from "./events-table"
import { EventDetailsSheet } from "./event-details-sheet"
import type { EventItem } from "@/lib/data/events"
import { toast } from "sonner" // ✅ use Sonner directly

export default function InvoicePage({ events }: { events: EventItem[] }) {
  const router = useRouter()
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  function handleGenerateInvoice(ev: EventItem) {
    router.push(`/invoice/${ev.id}`)

    toast("Opening invoice…", {
      description: `Loading invoice for ${ev.name}...`,
    })
  }

  function handleViewDetails(ev: EventItem) {
    setSelectedEvent(ev)
    setDetailsOpen(true)
  }

  return (
    <div className="mx-auto max-w-8xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Invoices</CardTitle>
          <CardDescription className="text-pretty">
            Review your events and generate invoices with one click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventsTable
            events={events}
            onGenerateInvoice={handleGenerateInvoice}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>

      {selectedEvent && (
        <EventDetailsSheet
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          event={selectedEvent}
        />
      )}
    </div>
  )
}
