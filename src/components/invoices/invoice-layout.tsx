"use client"

import { currency, type EventItem } from "@/lib/data/events"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type InvoiceLayoutProps = {
  event: EventItem
  company?: {
    name: string
    address: string
    email?: string
    phone?: string
  }
  billTo?: {
    name: string
    address?: string
    email?: string
  }
}

export function InvoiceLayout({ event, company, billTo }: InvoiceLayoutProps) {
  const subtotal = event.attendees * event.pricePerAttendee
  const tax = subtotal * event.taxRate
  const total = subtotal + tax

  const onPrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <div id="invoice-section">
  <div className="mx-auto max-w-3xl p-4 md:p-8 print:p-0 ">
    {/* Header */}
    <header className="mb-6 flex items-center justify-between print:mb-4">
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <img
          src="/logo1.png"
          alt="Logo"
          width={60}
          height={60}
          className="object-contain"
        />
      </div>

      {/* Center: Invoice title */}
      <div className="flex-1 ml-40 text-center">
        <h1 className="text-2xl font-semibold tracking-tight ">
          INVOICE
        </h1>
        {/* <p className="text-sm text-muted-foreground">
          Reference: {event.reference || event.id}
        </p> */}
      </div>

      {/* Right: Company info */}
      <div className="text-right flex-shrink-0">
        <p className="font-medium">{company?.name || "Your Company"}</p>
        <p className="text-sm text-muted-foreground">
          {company?.address || "123 Business St, City, Country"}
        </p>
        {company?.email && (
          <p className="text-sm text-muted-foreground">{company.email}</p>
        )}
        {company?.phone && (
          <p className="text-sm text-muted-foreground">{company.phone}</p>
        )}
      </div>
    </header>


      {/* Parties */}
      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 print:mb-4">
        <Card className="shadow-sm print:shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Billed To</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm leading-relaxed">
            <p className="font-medium">{billTo?.name || event.organizer || "Client Organization"}</p>
            <p className="text-muted-foreground">{billTo?.address || "Client Address, City, Country"}</p>
            {billTo?.email ? <p className="text-muted-foreground">{billTo.email}</p> : null}
          </CardContent>
        </Card>
        <Card className="shadow-sm print:shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm leading-relaxed">
            <p>
              <span className="text-muted-foreground">Event:</span> {event.name}
            </p>
            <p>
              <span className="text-muted-foreground">Date:</span> {event.date}
            </p>
            <p>
              <span className="text-muted-foreground">Location:</span> {event.location}
            </p>
            {event.notes ? <p className="text-muted-foreground mt-2">{event.notes}</p> : null}
          </CardContent>
        </Card>
      </section>

      {/* Line items */}
      <section className="mb-6 print:mb-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left text-sm font-medium text-muted-foreground">Description</th>
                <th className="py-2 text-right text-sm font-medium text-muted-foreground">Qty</th>
                <th className="py-2 text-right text-sm font-medium text-muted-foreground">Unit Price</th>
                <th className="py-2 text-right text-sm font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 text-sm">Event Attendance - {event.name}</td>
                <td className="py-3 text-right text-sm">{event.attendees}</td>
                <td className="py-3 text-right text-sm">{currency(event.pricePerAttendee)}</td>
                <td className="py-3 text-right text-sm">{currency(subtotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Totals */}
      <section className="mb-6 flex flex-col items-end gap-2 print:mb-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{currency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tax ({Math.round(event.taxRate * 100)}%)</span>
            <span className="font-medium">{currency(tax)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t pt-2 text-base">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{currency(total)}</span>
          </div>
        </div>
      </section>

      {/* Footer and actions */}
      <section className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground print:hidden">
         <p className="text-xs text-muted-foreground print:hidden">
  This is a computer-generated invoice and does not require a signature.
</p>

        </p>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={() => history.back()}>
            Back
          </Button>
          <Button onClick={onPrint}>Print / Download</Button>
        </div>
      </section>
    </div>
    </div>
  )
}
