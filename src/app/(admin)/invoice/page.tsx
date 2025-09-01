import InvoicePage from "@/components/invoices/invoice-page"
import { listEvents } from "@/lib/data/events"

export default async function Page() {
  const events = await listEvents()

  return (
    <main className="p-6">
      <InvoicePage events={events} />
    </main>
  )
}
