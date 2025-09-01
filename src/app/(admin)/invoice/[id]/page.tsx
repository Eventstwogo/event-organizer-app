import { notFound } from "next/navigation"
import { getEventById } from "@/lib/data/events"
import { InvoiceLayout } from "@/components/invoices/invoice-layout"

type Props = { params: { id: string } }

export const dynamic = "force-dynamic"

export default async function InvoiceByIdPage({ params }: Props) {
  const event = await getEventById(params.id)

  if (!event) return notFound()

  return (
    <main className="mx-auto max-w-5xl p-0 md:p-4 print:p-0">
      <InvoiceLayout
        event={event}
        company={{
          name: "Acme Events LLC",
          address: "500 Market St, San Francisco, CA 94103",
          email: "billing@acmeevents.com",
        }}
        billTo={{
          name: event.client?.name || "Client",
          email: event.client?.email || "client@example.com",
        }}
      />
    </main>
  )
}
