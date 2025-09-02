"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const currency = (value: number, code: string = "AUD") =>
  new Intl.NumberFormat(code === "AUD" ? "en-AUD" : "en-US", {
    style: "currency",
    currency: code,
  }).format(value)

type FullDetailsModalProps = {
  open: boolean
  onClose: () => void
  data: any
}

export function FullDetailsModal({ open, onClose, data }: FullDetailsModalProps) {
  const { invoice, coupons, sales_rollup_by_label, capacity_snapshot } = data
  const curr = invoice.currency || "AUD"

  const totalGross = invoice.summary?.gross_ticket_revenue || 0
  const totalDiscount = invoice.summary?.coupon_discount || 0
  const totalNet = invoice.summary?.net_ticket_revenue || 0
  const grandTotal = invoice.summary?.grand_total_settlement || 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full overflow-y-auto max-h-[90vh] print:max-h-full">
        <DialogHeader>
          <DialogTitle>Invoice Dashboard</DialogTitle>
        </DialogHeader>

        {/* Invoice Summary */}
        <section className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Invoice Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Invoice No:</strong> {invoice.invoice_no}</p>
              <p><strong>Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
              <p><strong>Billing From:</strong> {invoice.billing_from?.name}</p>
              <p><strong>Billing To:</strong> {invoice.billing_to?.name}</p>
            </div>
            <div>
              <p><strong>Event:</strong> {invoice.event.title}</p>
              <p><strong>Period Start:</strong> {invoice.event.period_from}</p>
              <p><strong>Period End:</strong> {invoice.event.period_to}</p>
              <p><strong>Payment Gateway:</strong> {invoice.summary.payment_gateway}</p>
            </div>
          </div>

          <div className="mt-4 border-t pt-2 text-right">
            <p><strong>Gross Total:</strong> {currency(totalGross, curr)}</p>
            <p><strong>Total Discount:</strong> {currency(totalDiscount, curr)}</p>
            <p><strong>Net Total:</strong> {currency(totalNet, curr)}</p>
            <p className="text-lg font-bold"><strong>Grand Total:</strong> {currency(grandTotal, curr)}</p>
          </div>
        </section>

        {/* Coupons */}
        {coupons?.length > 0 && (
          <section className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2 border-b pb-1">Coupons</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200 text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 text-left">Code</th>
                    <th className="py-2 px-3 text-right">Percentage</th>
                    <th className="py-2 px-3 text-right">Issued</th>
                    <th className="py-2 px-3 text-right">Applied</th>
                    <th className="py-2 px-3 text-right">Redeemed</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c: any, idx: number) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="py-2 px-3">{c.coupon_code}</td>
                      <td className="py-2 px-3 text-right">{c.percentage}%</td>
                      <td className="py-2 px-3 text-right">{c.issued}</td>
                      <td className="py-2 px-3 text-right">{c.applied}</td>
                      <td className="py-2 px-3 text-right">{c.redeemed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Sales Rollup */}
        {sales_rollup_by_label?.length > 0 && (
          <section className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2 border-b pb-1">Sales Rollup by Label</h2>
            {sales_rollup_by_label.map((label: any, idx: number) => (
              <div key={idx} className="mb-4">
                <p className="font-medium mb-1">{label.category_label}</p>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border border-gray-200 text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="py-2 px-3 text-left">Price Tier</th>
                        <th className="py-2 px-3 text-right">Quantity</th>
                        <th className="py-2 px-3 text-right">Subtotal</th>
                        <th className="py-2 px-3 text-right">Discount</th>
                        <th className="py-2 px-3 text-right">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {label.price_tiers.map((tier: any, i: number) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="py-2 px-3">{tier.price}</td>
                          <td className="py-2 px-3 text-right">{tier.quantity}</td>
                          <td className="py-2 px-3 text-right">{currency(tier.price * tier.quantity, curr)}</td>
                          <td className="py-2 px-3 text-right">{currency(tier.discount || 0, curr)}</td>
                          <td className="py-2 px-3 text-right">{currency((tier.price * tier.quantity) - (tier.discount || 0), curr)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Capacity Snapshot */}
        {capacity_snapshot && (
          <section className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2 border-b pb-1">Capacity Snapshot</h2>

            {/* Daily Snapshot */}
            {Object.entries(capacity_snapshot.daily).map(([date, snapshot]: any) => (
              <div key={date} className="mb-4 p-3 border rounded-md bg-gray-50">
                <p className="font-medium mb-2">{date} — Slots: {snapshot.slots_count}, Tickets: {snapshot.overall_total_tickets}</p>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border border-gray-200 text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="py-1 px-2 text-left">Category</th>
                        <th className="py-1 px-2 text-right">Tickets</th>
                        <th className="py-1 px-2 text-left">Price Tiers × Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(snapshot.seat_categories).map(([cat, catData]: any, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="py-1 px-2">{cat}</td>
                          <td className="py-1 px-2 text-right">{catData.total_tickets}</td>
                          <td className="py-1 px-2">
                            {Object.entries(catData.price_tiers)
                              .map(([price, qty]) => `${price} × ${qty}`)
                              .join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Overall Snapshot */}
            <h3 className="font-medium mt-4 mb-2">Overall Totals</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200 text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="py-1 px-2 text-left">Category</th>
                    <th className="py-1 px-2 text-right">Tickets</th>
                    <th className="py-1 px-2 text-left">Price Tiers × Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(capacity_snapshot.overall.seat_categories).map(([cat, catData]: any, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-1 px-2">{cat}</td>
                      <td className="py-1 px-2 text-right">{catData.total_tickets}</td>
                      <td className="py-1 px-2">
                        {Object.entries(catData.price_tiers)
                          .map(([price, qty]) => `${price} × ${qty}`)
                          .join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
