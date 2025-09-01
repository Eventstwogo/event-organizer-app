"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// ✅ Dummy events (adjust to your real EventItem type if needed)
const dummyEvents = [
  {
    id: "evt-001",
    name: "Tech Conference 2025",
    date: "2025-09-15",
    attendees: 120,
    pricePerTicket: 199,
    client: {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
    },
  },
  {
    id: "evt-002",
    name: "Wedding Reception",
    date: "2025-10-01",
    attendees: 80,
    pricePerTicket: 150,
    client: {
      name: "David Smith",
      email: "david.smith@example.com",
    },
  },
  {
    id: "evt-003",
    name: "Charity Gala Dinner",
    date: "2025-11-20",
    attendees: 200,
    pricePerTicket: 100,
    client: {
      name: "Grace Lee",
      email: "grace.lee@example.com",
    },
  },
]

// ✅ Currency formatter
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// ✅ Invoice dialog component
function GenerateInvoiceDialog({
  open,
  onOpenChange,
  event,
  onGenerated,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  event: any | null
  onGenerated: (invoiceId: string) => void
}) {
  const [billToName, setBillToName] = useState("")
  const [billToEmail, setBillToEmail] = useState("")
  const [taxRate, setTaxRate] = useState<number>(8.25)
  const [notes, setNotes] = useState("Thank you for your business!")

  useEffect(() => {
    if (event) {
      setBillToName(event.client?.name || "")
      setBillToEmail(event.client?.email || "")
    }
  }, [event])

  const calc = useMemo(() => {
    if (!event) return { subtotal: 0, tax: 0, total: 0 }
    const subtotal = event.attendees * event.pricePerTicket
    const tax = subtotal * (isNaN(taxRate) ? 0 : taxRate / 100)
    const total = subtotal + tax
    return { subtotal, tax, total }
  }, [event, taxRate])

  function handleGenerate() {
    if (!event) return
    const invoiceId = `INV-${event.id}-${new Date()
      .toISOString()
      .slice(0, 10)}`
    console.log("✅ Invoice generated:", invoiceId)
    onGenerated(invoiceId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby="generate-invoice-description"
        className="max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="text-balance">
            Generate Invoice
          </DialogTitle>
          <DialogDescription id="generate-invoice-description">
            Create an invoice for the selected event.
          </DialogDescription>
        </DialogHeader>

        {!event ? (
          <p className="text-sm text-muted-foreground">
            No event selected.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="event">Event</Label>
                <Input id="event" value={event.name} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={new Date(event.date).toLocaleDateString()}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billToName">Bill To (Name)</Label>
                <Input
                  id="billToName"
                  placeholder="Client name"
                  value={billToName}
                  onChange={(e) => setBillToName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billToEmail">Bill To (Email)</Label>
                <Input
                  id="billToEmail"
                  type="email"
                  placeholder="client@example.com"
                  value={billToEmail}
                  onChange={(e) => setBillToEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendees">Attendees</Label>
                <Input id="attendees" value={event.attendees} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Ticket</Label>
                <Input
                  id="price"
                  value={formatCurrency(event.pricePerTicket)}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  inputMode="decimal"
                  value={taxRate}
                  onChange={(e) =>
                    setTaxRate(Number.parseFloat(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Add any notes to appear on the invoice"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-medium">
                  {formatCurrency(calc.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tax</span>
                <span className="font-medium">
                  {formatCurrency(calc.tax)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total</span>
                <span className="text-base font-semibold">
                  {formatCurrency(calc.total)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} aria-label="Generate invoice">
                Generate Invoice
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ✅ Demo wrapper to show event list
export default function InvoiceDemo() {
  const [open, setOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)

  function handleGenerated(invoiceId: string) {
    alert(`Invoice generated: ${invoiceId}`)
    setOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Event List</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dummyEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Attendees:</span>{" "}
                {event.attendees}
              </p>
              <p>
                <span className="font-medium">Price:</span> $
                {event.pricePerTicket}
              </p>
              <Button
                onClick={() => {
                  setSelectedEvent(event)
                  setOpen(true)
                }}
              >
                Generate Invoice
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <GenerateInvoiceDialog
        open={open}
        onOpenChange={setOpen}
        event={selectedEvent}
        onGenerated={handleGenerated}
      />
    </div>
  )
}
