export type EventItem = {
  pricePerTicket: number
  client: any
  id: string
  name: string
  date: string
  location: string
  attendees: number
  pricePerAttendee: number
  taxRate: number // decimal e.g. 0.1 for 10%
  reference?: string
  organizer?: string
  notes?: string
}

export const events: EventItem[] = [
  {
      id: "evt_1001",
      name: "Annual Tech Conference",
      date: "2025-09-15",
      location: "San Francisco, CA",
      attendees: 120,
      pricePerAttendee: 199,
      taxRate: 0.08,
      reference: "ATC-2025",
      organizer: "Tech Co.",
      notes: "VIP seating for sponsors.",
      pricePerTicket: 0,
      client: undefined
  },
  {
      id: "evt_1002",
      name: "Design Summit",
      date: "2025-10-02",
      location: "New York, NY",
      attendees: 80,
      pricePerAttendee: 249,
      taxRate: 0.08,
      reference: "DS-2025",
      organizer: "Design Labs",
      notes: "Requires stage lighting setup.",
      pricePerTicket: 0,
      client: undefined
  },
  {
      id: "evt_1003",
      name: "Marketing Meetup",
      date: "2025-11-20",
      location: "Austin, TX",
      attendees: 60,
      pricePerAttendee: 149,
      taxRate: 0.07,
      reference: "MM-2025",
      organizer: "MarketHub",
      notes: "Coffee and snacks included.",
      pricePerTicket: 0,
      client: undefined
  },
]

export function listEvents(): Promise<EventItem[]> {
  return Promise.resolve(events)
}

export function getEventById(id: string): Promise<EventItem | undefined> {
  return Promise.resolve(events.find((e) => e.id === id))
}

export function currency(v: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v)
}
