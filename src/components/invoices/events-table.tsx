"use client"

import type { EventItem } from "@/lib/data/events"
import { formatCurrency } from "./money"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function EventsTable({
  events,
  onGenerateInvoice,
  onViewDetails,
}: {
  events: EventItem[]
  onGenerateInvoice: (ev: EventItem) => void
  onViewDetails: (ev: EventItem) => void
}) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Attendees</TableHead>
            <TableHead className="text-right">Price/Attendee</TableHead>
            <TableHead className="text-right">Potential Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((ev) => {
            const subtotal = ev.attendees * ev.pricePerAttendee
            return (
              <TableRow key={ev.id}>
                <TableCell className="font-medium">{ev.name}</TableCell>
                <TableCell>{new Date(ev.date).toLocaleDateString()}</TableCell>
                <TableCell>{ev.location}</TableCell>
                <TableCell className="text-right">{ev.attendees}</TableCell>
                <TableCell className="text-right">{formatCurrency(ev.pricePerAttendee)}</TableCell>
                <TableCell className="text-right">{formatCurrency(subtotal)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" aria-label={`Open actions for ${ev.name}`}>
                        View
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onGenerateInvoice(ev)}>Generate Invoice</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onViewDetails(ev)}>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
