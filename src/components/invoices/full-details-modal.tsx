"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const currency = (value: number, code: string = "AUD") =>
  new Intl.NumberFormat(code === "AUD" ? "en-AU" : "en-US", {
    style: "currency",
    currency: code,
  }).format(value)

type FullDetailsModalProps = {
  open: boolean
  onClose: () => void
  data: any
}

export function FullDetailsModal({ open, onClose, data }: FullDetailsModalProps) {
  const { invoice, coupons, sales_rollup_by_label, capacity_snapshot, organizer } = data
  const curr = invoice?.currency || "AUD"

  const totalGross = invoice?.summary?.gross_ticket_revenue || 0
  const totalDiscount = invoice?.summary?.coupon_discount || 0
  const totalNet = invoice?.summary?.net_ticket_revenue || 0
  const grandTotal = invoice?.summary?.grand_total_settlement || 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[95vw] md:max-w-[85vw] sm:max-w-[90vw] max-h-[95vh] overflow-y-auto print:max-h-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Invoice Dashboard</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Invoice Summary
                <Badge variant={invoice?.event?.status === "ACTIVE" ? "default" : "secondary"}>
                  {invoice?.event?.status || "N/A"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Basic Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-600 uppercase">Invoice Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Invoice No:</span> {invoice?.invoice_no || "N/A"}</p>
                    <p><span className="font-medium">Date:</span> {invoice?.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : "N/A"}</p>
                    <p><span className="font-medium">Currency:</span> {invoice?.currency || "N/A"}</p>
                    <p><span className="font-medium">Payment Gateway:</span> {invoice?.summary?.payment_gateway || "N/A"}</p>
                  </div>
                </div>

                {/* Event Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-600 uppercase">Event Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Event:</span> {invoice?.event?.title || "N/A"}</p>
                    <p><span className="font-medium">Category:</span> {invoice?.event?.category || "N/A"}</p>
                    <p><span className="font-medium">Subcategory:</span> {invoice?.event?.subcategory || "N/A"}</p>
                    <p><span className="font-medium">Period:</span> {invoice?.event?.period_from && invoice?.event?.period_to ? `${invoice.event.period_from} to ${invoice.event.period_to}` : "N/A"}</p>
                    <p><span className="font-medium">Location:</span> {invoice?.event?.location || "N/A"}</p>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-600 uppercase">Billing Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">From:</span> {invoice?.billing_from?.name || "N/A"}</p>
                    <p><span className="font-medium">From Address:</span> {invoice?.billing_from?.address || "N/A"}</p>
                    <p><span className="font-medium">From GSTIN:</span> {invoice?.billing_from?.gstin || "N/A"}</p>
                    <p><span className="font-medium">To:</span> {invoice?.billing_to?.name || "N/A"}</p>
                    <p><span className="font-medium">To Email:</span> {invoice?.billing_to?.email || "N/A"}</p>
                    <p><span className="font-medium">To Address:</span> {invoice?.billing_to?.address || "N/A"}</p>
                    <p><span className="font-medium">To GSTIN:</span> {invoice?.billing_to?.gstin || "N/A"}</p>
                    <p><span className="font-medium">Organizer:</span> {organizer?.name || "N/A"}</p>
                    <p><span className="font-medium">Organizer Contact:</span> {organizer?.contact || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{invoice?.summary?.orders_count || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Tickets Sold</p>
                    <p className="text-2xl font-bold text-green-600">{invoice?.summary?.tickets_sold || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Unique Buyers</p>
                    <p className="text-2xl font-bold text-purple-600">{invoice?.summary?.unique_buyers || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Discount Rate</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {totalGross > 0 ? ((totalDiscount / totalGross) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-2 border-t pt-4">
                  <p className="text-lg"><span className="font-medium">Gross Total:</span> {currency(totalGross, curr)}</p>
                  <p className="text-lg text-red-600"><span className="font-medium">Total Discount:</span> -{currency(totalDiscount, curr)}</p>
                  <p className="text-lg"><span className="font-medium">Net Total:</span> {currency(totalNet, curr)}</p>
                  <p className="text-lg"><span className="font-medium">Platform Fee:</span> {currency(invoice?.summary?.platform_fee || 0, curr)}</p>
                  <p className="text-lg"><span className="font-medium">Processing Fee:</span> {currency(invoice?.summary?.processing_fee || 0, curr)}</p>
                  <p className="text-lg"><span className="font-medium">Tax on Fees:</span> {currency(invoice?.summary?.tax_on_fees || 0, curr)}</p>
                  <p className="text-xl font-bold border-t pt-2">
                    <span className="font-bold">Grand Total:</span> {currency(grandTotal, curr)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Lines */}
          {invoice?.lines?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Invoice Lines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-right">Unit Price</th>
                        <th className="py-3 px-4 text-center">Quantity</th>
                        <th className="py-3 px-4 text-right">Subtotal</th>
                        <th className="py-3 px-4 text-right">Discount</th>
                        <th className="py-3 px-4 text-right">Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lines.map((line: any, idx: number) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="py-2 px-4">{line.date}</td>
                          <td className="py-2 px-4">{line.category_label}</td>
                          <td className="py-2 px-4 text-right">{currency(line.unit_price, curr)}</td>
                          <td className="py-2 px-4 text-center">{line.quantity}</td>
                          <td className="py-2 px-4 text-right">{currency(line.subtotal, curr)}</td>
                          <td className="py-2 px-4 text-right text-red-600">{currency(line.discount || 0, curr)}</td>
                          <td className="py-2 px-4 text-right font-medium">{currency(line.net, curr)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sales Performance by Category */}
          {sales_rollup_by_label?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {sales_rollup_by_label.map((label: any, idx: number) => {
                    const conversionRate = totalGross > 0 ? ((label.total_net / totalGross) * 100).toFixed(1) : 0
                    return (
                      <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-semibold text-lg mb-2">{label.category_label}</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Quantity:</span> {label.total_quantity}</p>
                          <p><span className="font-medium">Subtotal:</span> {currency(label.total_subtotal, curr)}</p>
                          <p><span className="font-medium">Discount:</span> {currency(label.total_discount, curr)}</p>
                          <p><span className="font-medium">Net:</span> {currency(label.total_net, curr)}</p>
                          <p><span className="font-medium">% of Total:</span> {conversionRate}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Detailed breakdown table */}
                <div className="space-y-4">
                  {sales_rollup_by_label.map((label: any, idx: number) => (
                    <div key={idx}>
                      <h4 className="font-medium mb-2 text-lg">{label.category_label} - Detailed Breakdown</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 text-left">Price Tier</th>
                              <th className="py-3 px-4 text-center">Quantity</th>
                              <th className="py-3 px-4 text-right">Subtotal</th>
                              <th className="py-3 px-4 text-right">Discount</th>
                              <th className="py-3 px-4 text-right">Net Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {label.price_tiers.map((tier: any, i: number) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="py-2 px-4 font-medium">{currency(tier.price, curr)}</td>
                                <td className="py-2 px-4 text-center">{tier.quantity}</td>
                                <td className="py-2 px-4 text-right">{currency(tier.price * tier.quantity, curr)}</td>
                                <td className="py-2 px-4 text-right text-red-600">{currency(tier.discount || 0, curr)}</td>
                                <td className="py-2 px-4 text-right font-medium">{currency((tier.price * tier.quantity) - (tier.discount || 0), curr)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coupon Analysis */}
          {coupons?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Coupon Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left">Coupon Code</th>
                        <th className="py-3 px-4 text-center">Discount %</th>
                        <th className="py-3 px-4 text-center">Issued</th>
                        <th className="py-3 px-4 text-center">Applied</th>
                        <th className="py-3 px-4 text-center">Redeemed</th>
                        <th className="py-3 px-4 text-center">Usage Rate</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((c: any, idx: number) => {
                        const usageRate = c.issued > 0 ? ((c.redeemed / c.issued) * 100).toFixed(1) : 0
                        return (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="py-3 px-4 font-mono font-medium">{c.coupon_code}</td>
                            <td className="py-3 px-4 text-center">{c.percentage}%</td>
                            <td className="py-3 px-4 text-center">{c.issued}</td>
                            <td className="py-3 px-4 text-center">{c.applied}</td>
                            <td className="py-3 px-4 text-center">{c.redeemed}</td>
                            <td className="py-3 px-4 text-center">{usageRate}%</td>
                            <td className="py-3 px-4 text-center">
                              <Badge variant={c.status ? "default" : "secondary"}>
                                {c.status ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center text-xs text-gray-600">
                              {new Date(c.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Capacity Overview */}
          {capacity_snapshot && (
            <Card>
              <CardHeader>
                <CardTitle>Capacity & Availability Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Overall Summary */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Overall Event Capacity</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{capacity_snapshot?.overall?.slots_count || 0}</p>
                      <p className="text-sm text-gray-600">Total Slots</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{capacity_snapshot?.overall?.overall_total_tickets?.toLocaleString() || 0}</p>
                      <p className="text-sm text-gray-600">Total Tickets</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{capacity_snapshot?.overall?.seat_categories ? Object.keys(capacity_snapshot.overall.seat_categories).length : 0}</p>
                      <p className="text-sm text-gray-600">Categories</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {capacity_snapshot?.overall?.overall_total_tickets > 0 
                          ? ((invoice?.summary?.tickets_sold / capacity_snapshot.overall.overall_total_tickets) * 100).toFixed(2)
                          : 0}%
                      </p>
                      <p className="text-sm text-gray-600">Sold</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 text-sm bg-white rounded">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-3 text-left">Category</th>
                          <th className="py-2 px-3 text-center">Total Tickets</th>
                          <th className="py-2 px-3 text-center">Price</th>
                          <th className="py-2 px-3 text-center">Potential Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {capacity_snapshot?.overall?.seat_categories && Object.entries(capacity_snapshot.overall.seat_categories).map(([cat, catData]: any, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="py-2 px-3 font-medium">{cat}</td>
                            <td className="py-2 px-3 text-center">{catData.total_tickets.toLocaleString()}</td>
                            <td className="py-2 px-3 text-center">
                              {Object.entries(catData.price_tiers)
                                .map(([price, qty]) => currency(parseFloat(price), curr))
                                .join(", ")}
                            </td>
                            <td className="py-2 px-3 text-center font-medium">
                              {currency(
                                Object.entries(catData.price_tiers)
                                  .reduce((sum: number, [price, qty]: any) => sum + (parseFloat(price) * qty), 0),
                                curr
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Daily breakdown - show only first few days */}
                <div>
                  <h3 className="font-semibold mb-3">Daily Capacity Breakdown (Sample)</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {capacity_snapshot?.daily && Object.entries(capacity_snapshot.daily).slice(0, 3).map(([date, snapshot]: any) => (
                      <div key={date} className="p-3 border rounded-md bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{date}</h4>
                          <div className="text-sm text-gray-600">
                            Slots: {snapshot.slots_count} | Tickets: {snapshot.overall_total_tickets.toLocaleString()}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {Object.entries(snapshot.seat_categories).map(([cat, catData]: any) => (
                            <div key={cat} className="text-center p-2 bg-white rounded">
                              <p className="font-medium">{cat}</p>
                              <p className="text-xs text-gray-600">{catData.total_tickets} tickets</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {capacity_snapshot?.daily && Object.keys(capacity_snapshot.daily).length > 3 && (
                      <p className="text-center text-sm text-gray-500 italic">
                        ... and {Object.keys(capacity_snapshot.daily).length - 3} more days
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invoice Notes */}
          {invoice?.notes?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Invoice Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {invoice.notes.map((note: string, idx: number) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-500">
            Generated on {new Date().toLocaleString()}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => window.print()}>
              Print
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}