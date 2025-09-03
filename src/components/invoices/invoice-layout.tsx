"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Currency formatter (defaults to AUD)
const currency = (value: number, code: string = "AUD") =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: code,
  }).format(value);

type InvoiceLayoutProps = {
  invoice: any // using API shape directly
}

export function InvoiceLayout({ invoice }: InvoiceLayoutProps) {
  const {
    invoice_no,
    invoice_date,
    currency: curr,
    billing_from,
    billing_to,
    event,
    lines,
    summary,
    notes,
  } = invoice

  const onPrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <div id="invoice-section">
      <div className="mx-auto max-w-3xl p-4 md:p-8 print:p-0">
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
            <h1 className="text-2xl font-semibold tracking-tight">INVOICE</h1>
            <p className="text-sm text-muted-foreground">{invoice_no}</p>
            <p className="text-xs text-muted-foreground">
              Date: {new Date(invoice_date).toLocaleDateString()}
            </p>
          </div>

          {/* Right: Company info */}
          <div className="text-right flex-shrink-0">
            <p className="font-medium">{billing_from?.name || "Your Company"}</p>
            <p className="text-sm text-muted-foreground">
              {billing_from?.address || "123 Business St, City, Country"}
            </p>
            {billing_from?.gstin && (
              <p className="text-sm text-muted-foreground">
                GSTIN: {billing_from.gstin}
              </p>
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
              <div className="flex items-center gap-2">
                {billing_to?.profile_picture && (
                  <img
                    src={billing_to.profile_picture}
                    alt={billing_to.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <p className="font-medium">
                  {billing_to?.name || "Client Organization"}
                </p>
              </div>
              <p className="text-muted-foreground">
                {billing_to?.address || "Client Address"}
              </p>
              {billing_to?.email && (
                <p className="text-muted-foreground">{billing_to.email}</p>
              )}
              {billing_to?.gstin && (
                <p className="text-muted-foreground">GSTIN: {billing_to.gstin}</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm print:shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed">
              {event.card_image && (
                <img
                  src={event.card_image}
                  alt={event.title}
                  className="mb-2 h-24 w-full object-cover rounded-md"
                />
              )}
              <p>
                <span className="text-muted-foreground">Event:</span> {event.title}
              </p>
              <p>
                <span className="text-muted-foreground">From:</span>{" "}
                {event.period_from}
              </p>
              <p>
                <span className="text-muted-foreground">To:</span> {event.period_to}
              </p>
              {event.location && (
                <p>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  {event.location}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Line items */}
        <section className="mb-6 print:mb-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="py-2 text-right text-sm font-medium text-muted-foreground">
                    Qty
                  </th>
                  <th className="py-2 text-right text-sm font-medium text-muted-foreground">
                    Unit Price
                  </th>
                  <th className="py-2 text-right text-sm font-medium text-muted-foreground">
                    Subtotal
                  </th>
                  <th className="py-2 text-right text-sm font-medium text-muted-foreground">
                    Discount
                  </th>
                  <th className="py-2 text-right text-sm font-medium text-muted-foreground">
                    Net
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line: any, i: number) => (
                  <tr key={i} className="border-b">
                    <td className="py-3 text-sm">{line.category_label}</td>
                    <td className="py-3 text-right text-sm">{line.quantity}</td>
                    <td className="py-3 text-right text-sm">
                      {currency(line.unit_price, curr)}
                    </td>
                    <td className="py-3 text-right text-sm">
                      {currency(line.subtotal, curr)}
                    </td>
                    <td className="py-3 text-right text-sm">
                      {currency(line.discount, curr)}
                    </td>
                    <td className="py-3 text-right text-sm">
                      {currency(line.net, curr)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Totals */}
        <section className="mb-6 flex flex-col items-end gap-2 print:mb-4">
          <div className="w-full max-w-sm text-sm">
            <div className="flex justify-between">
              <span>Gross Revenue</span>
              <span>{currency(summary.gross_ticket_revenue, curr)}</span>
            </div>
            <div className="flex justify-between">
              <span>Featured Amount</span>
              <span>{currency(summary.featured_amount, curr)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Discounts</span>
              <span>- {currency(summary.coupon_discount, curr)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Net Revenue</span>
              <span>{currency(summary.net_ticket_revenue, curr)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>Grand Total</span>
              <span>{currency(summary.grand_total_settlement, curr)}</span>
            </div>
          </div>
        </section>

        {/* Notes */}
        {notes?.length > 0 && (
          <section className="mb-6 print:mb-4">
            <h2 className="text-sm font-medium mb-2">Notes</h2>
            <div className="rounded-md border bg-muted/50 p-3">
              <ul className="list-disc pl-6 text-xs text-muted-foreground space-y-1">
                {notes.map((note: string, idx: number) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Footer and actions */}
        <section className="flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground print:hidden">
            This is a computer-generated invoice and does not require a signature.
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
