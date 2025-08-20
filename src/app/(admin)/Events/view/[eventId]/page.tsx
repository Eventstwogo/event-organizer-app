"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import axiosInstance from "@/lib/axiosinstance"
import { toast } from "sonner"
import Image from "next/image"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Tag,
  Users,
  DollarSign,
  Globe,
  UserCheck,
  ImageIcon,
  Edit,
  Eye,
  TrendingUp,
  BarChart3,
  Activity,
  Star,
} from "lucide-react"

interface SeatCategory {
  seat_category_id: string
  label: string
  price: number
  totalTickets: number
  booked: number
  held: number
  available: number
}

interface SlotData {
  slot_id: string
  time: string
  duration: string
  end_time: string
  seatCategories: SeatCategory[]
}

interface SlotAnalytics {
  overall_slots: number
  overall_tickets: number
  overall_booked: number
  overall_held: number
  overall_available: number
  per_day: {
    [date: string]: {
      total_slots: number
      total_tickets: number
      booked_tickets: number
      held_tickets: number
      available_tickets: number
    }
  }
}

interface EventData {
  event_id: string
  event_title: string
  event_slug: string
  event_type: string
  event_dates: string[]
  location: string | null
  is_online: boolean
  event_status: string
  featured_event: boolean
  category: {
    category_id: string
    category_name: string
    category_slug: string
    category_img_thumbnail: string
  }
  subcategory: {
    subcategory_id: string
    subcategory_name: string
    subcategory_slug: string
    subcategory_img_thumbnail: string
  }
  organizer: {
    user_id: string
    username: string
    profile_picture: string | null
  }
  slots: {
    event_ref_id: string
    event_dates: string[]
    slot_data: {
      [date: string]: SlotData[]
    }
    slot_analytics: SlotAnalytics
  }[]
  card_image: string
  banner_image: string
  event_extra_images: string[] | null
  extra_data: {
    address: string
    duration: string
    language: string
    organizer: string
    description: string
    additionalInfo: string
    ageRestriction: string
  }
  hash_tags: string[]
  created_at: string
}

const EventViewPage = () => {
  const router = useRouter()
  const params = useParams()
  const eventId = params.eventId as string

  const [eventData, setEventData] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Load event data
  const loadEventData = useCallback(async () => {
    if (!eventId) return

    setLoading(true)
    try {
      const eventResponse = await axiosInstance.get(`/new-events/${eventId}`)
      const event = eventResponse.data.data
      setEventData(event)
    } catch (error) {
      console.error("Error loading event data:", error)
      toast.error("Failed to load event details")
      router.push("/Events")
    } finally {
      setLoading(false)
    }
  }, [eventId, router])

  const handleEditEvent = () => {
    if (eventData) {
      router.push(`/Events/BasicInfo?event_id=${eventData.event_id}`)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const formatCurrency = (amount: number, currency = "AUD") => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const calculateTotalRevenue = () => {
    if (!eventData?.slots?.[0]?.slot_analytics) return 0

    let totalRevenue = 0
    const slotData = eventData.slots[0].slot_data

    Object.values(slotData).forEach((daySlots) => {
      daySlots.forEach((slot) => {
        slot.seatCategories.forEach((category) => {
          totalRevenue += category.price * category.booked
        })
      })
    })

    return totalRevenue
  }

  const calculateOccupancyRate = () => {
    if (!eventData?.slots?.[0]?.slot_analytics) return 0

    const analytics = eventData.slots[0].slot_analytics
    if (analytics.overall_tickets === 0) return 0

    return ((analytics.overall_booked + analytics.overall_held) / analytics.overall_tickets) * 100
  }

  // Get all available images
  const getAllImages = () => {
    const images = []
    if (eventData?.card_image) images.push({ src: eventData.card_image, type: "Card Image" })
    if (eventData?.banner_image) images.push({ src: eventData.banner_image, type: "Banner Image" })
    if (eventData?.event_extra_images) {
      eventData.event_extra_images.forEach((img, index) => {
        images.push({ src: img, type: `Gallery Image ${index + 1}` })
      })
    }
    return images
  }

  useEffect(() => {
    loadEventData()
  }, [loadEventData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-10 w-32 bg-blue-200 rounded"></div>
              <div className="h-8 w-48 bg-purple-200 rounded"></div>
            </div>

            {/* Analytics cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg"></div>
              ))}
            </div>

            {/* Main content skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                <div className="h-64 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg"></div>
                <div className="h-32 bg-gradient-to-r from-teal-100 to-green-100 rounded-lg"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gradient-to-b from-orange-100 to-red-100 rounded-lg"></div>
                <div className="h-32 bg-gradient-to-b from-indigo-100 to-purple-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
            <p className="text-gray-600 mb-6">
              The event you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button onClick={() => router.push("/Events")} className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const allImages = getAllImages()
  const analytics = eventData.slots?.[0]?.slot_analytics
  const totalRevenue = calculateTotalRevenue()
  const occupancyRate = calculateOccupancyRate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              onClick={() => router.push("/Events")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 font-sans">Event Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive event management and analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleEditEvent}
              className="bg-gradient-to-r from-blue-300 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white flex items-center gap-2 shadow-lg"
            >
              <Edit className="h-4 w-4" />
              Edit Event
            </Button>
          </div>
        </div>

        {/* {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-100">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Total Bookings</p>
                    <p className="text-2xl font-bold text-white">{analytics.overall_booked}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-white">{occupancyRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <Progress value={occupancyRate} className="mt-3 bg-white/20" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-100">Active Slots</p>
                    <p className="text-2xl font-bold text-white">{analytics.overall_slots}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )} */}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Event Header */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Title and Basic Info */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4">
                      <div className="space-y-3">
                        <h1 className="text-4xl font-bold text-gray-800 leading-tight break-words font-sans">
                          {eventData.event_title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                            {eventData.category.category_name}
                          </Badge>
                          {eventData.subcategory && (
                            <Badge variant="outline" className="px-3 py-1 border-purple-300 text-purple-700">
                              {eventData.subcategory.subcategory_name}
                            </Badge>
                          )}
                          {eventData.is_online && (
                            <Badge className="px-3 py-1 bg-gradient-to-r from-teal-500 to-green-500 text-white">
                              <Globe className="h-3 w-3 mr-1" />
                              Online Event
                            </Badge>
                          )}
                          {eventData.featured_event && (
                            <Badge className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Event Duration</p>
                          <p className="text-base text-gray-800 font-semibold">{eventData.event_dates.length} Days</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Date Range</p>
                          <p className="text-base text-gray-800 font-semibold">
                            {formatDate(eventData.event_dates[0])} -{" "}
                            {formatDate(eventData.event_dates[eventData.event_dates.length - 1])}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images Gallery */}
            {allImages.length > 0 && (
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-xl font-bold flex items-center gap-2 font-sans text-gray-800">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-white" />
                    </div>
                    Event Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {/* Main Image Display */}
                  <div className="relative h-80 w-full rounded-lg overflow-hidden border-2 border-indigo-200 bg-gray-100 shadow-lg">
                    <Image
                      src={allImages[activeImageIndex]?.src || allImages[0].src}
                      alt={allImages[activeImageIndex]?.type || "Event image"}
                      fill
                      className="object-cover transition-all duration-300"
                      priority
                    />
                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-black/70 to-gray-800/70 text-white px-3 py-1 rounded-lg text-sm">
                      {allImages[activeImageIndex]?.type || allImages[0].type}
                    </div>
                  </div>

                  {/* Image Thumbnails */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`relative h-16 w-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                            activeImageIndex === index
                              ? "border-indigo-500 ring-2 ring-indigo-200 shadow-lg"
                              : "border-gray-300 hover:border-indigo-400"
                          }`}
                        >
                          <Image src={image.src || "/placeholder.svg"} alt={image.type} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {eventData.extra_data.description && (
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="p-6 bg-gradient-to-r from-teal-50 to-green-50">
                  <CardTitle className="text-xl font-bold font-sans text-gray-800">Description</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {eventData.extra_data.description}
                    </p>
                  </div>

                  {eventData.extra_data.additionalInfo && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-gray-800 mb-2 text-base">Additional Information</h4>
                      <p className="text-base text-gray-700 whitespace-pre-wrap break-words">
                        {eventData.extra_data.additionalInfo}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {eventData.slots && eventData.slots.length > 0 && (
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="text-xl font-bold flex items-center gap-2 font-sans text-gray-800">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    Slot Analytics & Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {eventData.slots.map((slotInfo, slotIndex) => (
                    <div key={slotIndex} className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg border border-indigo-200">
                        <h4 className="font-semibold text-gray-800 text-lg font-sans">Event Slot Analytics</h4>
                        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                          {slotInfo.slot_analytics.overall_slots} Total Slots
                        </Badge>
                      </div>

                      {/* Daily Analytics */}
                      <div className="grid gap-4">
                        {Object.entries(slotInfo.slot_analytics.per_day).map(([date, dayAnalytics]) => {
                          const daySlots = slotInfo.slot_data[date] || []
                          const occupancyRate =
                            dayAnalytics.total_tickets > 0
                              ? ((dayAnalytics.booked_tickets + dayAnalytics.held_tickets) /
                                  dayAnalytics.total_tickets) *
                                100
                              : 0

                          return (
                            <Card
                              key={date}
                              className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                            >
                              <CardHeader className="p-4 pb-3">
                                <CardTitle className="text-lg flex items-center gap-2 text-gray-800 font-sans">
                                  <Calendar className="h-4 w-4 text-blue-600" />
                                  {formatDate(date)}
                                </CardTitle>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>Occupancy: {occupancyRate.toFixed(1)}%</span>
                                  <Progress value={occupancyRate} className="w-24 h-2" />
                                </div>
                              </CardHeader>
                              <CardContent className="p-4">
                                <div className="grid gap-4">
                                  {daySlots.map((slot, slotIdx) => (
                                    <div
                                      key={slot.slot_id}
                                      className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                                    >
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                          <Clock className="h-4 w-4 text-teal-600" />
                                          <span className="font-semibold text-gray-800">
                                            {slot.time} - {slot.end_time}
                                          </span>
                                          <Badge variant="outline" className="text-xs border-teal-300 text-teal-700">
                                            {slot.duration}
                                          </Badge>
                                        </div>
                                      </div>

                                      {/* Seat Categories */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {slot.seatCategories.map((category, categoryIndex) => {
                                          const categoryOccupancy =
                                            category.totalTickets > 0
                                              ? ((category.booked + category.held) / category.totalTickets) * 100
                                              : 0

                                          const gradientColors = [
                                            "from-emerald-100 to-green-100",
                                            "from-blue-100 to-indigo-100",
                                            "from-purple-100 to-pink-100",
                                            "from-orange-100 to-red-100",
                                          ]

                                          return (
                                            <div
                                              key={category.seat_category_id}
                                              className={`p-3 bg-gradient-to-br ${gradientColors[categoryIndex % 4]} rounded-lg border border-gray-200`}
                                            >
                                              <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-gray-800 text-sm">
                                                  {category.label}
                                                </span>
                                                <span className="font-bold text-green-600 text-lg">
                                                  ${category.price}
                                                </span>
                                              </div>
                                              <div className="space-y-1 text-xs text-gray-600">
                                                <div className="flex justify-between">
                                                  <span>Available:</span>
                                                  <span className="font-medium">{category.available}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span>Booked:</span>
                                                  <span className="font-medium">{category.booked}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span>Total:</span>
                                                  <span className="font-medium">{category.totalTickets}</span>
                                                </div>
                                              </div>
                                              <Progress value={categoryOccupancy} className="mt-2 h-1" />
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="p-6 bg-gradient-to-r from-green-50 to-teal-50">
                <CardTitle className="text-lg font-bold font-sans text-gray-800">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Location</p>
                    <p className="text-base text-gray-800 break-words">
                      {eventData.location ||
                        eventData.extra_data.address ||
                        (eventData.is_online ? "Online Event" : "Location not specified")}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Organizer</p>
                    <p className="text-base text-gray-800 font-semibold break-words">{eventData.organizer.username}</p>
                  </div>
                </div>

                {eventData.extra_data.language && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-teal-500 rounded-lg">
                        <Globe className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Language</p>
                        <p className="text-base text-gray-800 break-words">{eventData.extra_data.language}</p>
                      </div>
                    </div>
                  </>
                )}

                {eventData.extra_data.ageRestriction && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <UserCheck className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Age Restriction</p>
                        <p className="text-base text-gray-800 break-words">{eventData.extra_data.ageRestriction}</p>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Event Type</p>
                    <p className="text-base text-gray-800">{eventData.is_online ? "Online Event" : "Physical Event"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {eventData.hash_tags && eventData.hash_tags.length > 0 && (
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 font-sans text-gray-800">
                    <div className="p-2 bg-yellow-500 rounded-lg">
                      <Tag className="h-4 w-4 text-white" />
                    </div>
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {eventData.hash_tags.map((tag, index) => {
                      const tagColors = [
                        "bg-blue-100 text-blue-800 border-blue-300",
                        "bg-green-100 text-green-800 border-green-300",
                        "bg-purple-100 text-purple-800 border-purple-300",
                        "bg-orange-100 text-orange-800 border-orange-300",
                        "bg-pink-100 text-pink-800 border-pink-300",
                      ]

                      return (
                        <Badge
                          key={index}
                          className={`px-3 py-1 text-sm whitespace-normal break-words ${tagColors[index % 5]}`}
                        >
                          {tag.startsWith("#") ? tag : `#${tag}`}
                        </Badge>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {analytics && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-200 to-teal-400 text-white">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-bold text-white font-sans">Quick Analytics</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base text-indigo-100">Total Tickets</span>
                    <Badge className="bg-white/20 text-white border-white/30">
                      {analytics.overall_tickets.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base text-indigo-100">Tickets Sold</span>
                    <Badge className="bg-green-500 text-white">{analytics.overall_booked.toLocaleString()}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base text-indigo-100">Available</span>
                    <Badge className="bg-white/20 text-white border-white/30">
                      {analytics.overall_available.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base text-indigo-100">Event Status</span>
                    <Badge
                      className={
                        eventData.event_status === "ACTIVE" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                      }
                    >
                      {eventData.event_status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventViewPage
