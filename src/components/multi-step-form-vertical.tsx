"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Upload, ImageIcon, Info, ArrowRight, ArrowLeft, X, MapPin, Calendar, Clock } from "lucide-react"
import useStore from "@/lib/Zustand"
import type { EventType } from "@/components/EventType/columns"
import { toast } from "sonner"

import { useRouter } from "next/navigation"
import slugify from "slugify"
import axiosInstance from "@/lib/axiosinstance"
import { TimeSlotPopup } from "./eventcreationpopups/TimeSlotPopup"
import { CategoryPricingPopup } from "./eventcreationpopups/CategoryPricingPopup"

interface MyFormData {
  Country: string | number | readonly string[] | undefined
  State: string | number | readonly string[] | undefined
  suburb: string | number | readonly string[] | undefined
  title: string
  category: string
  subcategory: string
  description: string
  postalCode: string
  location: string
  eventType: string
  organizer: string
  address: string
  duration: string
  language: string
  ageRestriction: string
  additionalInfo: string
  tags: string
  mainImage: File | null
  bannerImage: File | null
  galleryImages: { file: File; preview: string }[]
  otherSubcategory?: string
  organizerName: string
  organizerContact: string
  organizerEmail: string
  startDate: string
  endDate: string
  selectedDates: string[]
  timeSlots: {
    [date: string]: TimeSlot[]
  }
  customCategories: { name: string; price: number }[]
}

interface TimeSlot {
  startTime: string
  endTime: string
  capacity: number
  duration: string
  seatCategories: TicketCategory[]
}

interface TicketCategory {
  id: string
  name: string
  price: number
  quantity: number
}

interface Category {
  category_id: string
  category_name: string
  category_slug: string
  subcategories?: Subcategory[]
}

interface Subcategory {
  subcategory_id: string
  subcategory_name: string
  subcategory_slug: string
}

const steps = [
  { id: 1, title: "Basic Information", icon: Info, description: "Event title, category and organizer" },
  { id: 2, title: "Event Details", icon: MapPin, description: "Description, location and specifications" },
  { id: 3, title: "Images & Media", icon: ImageIcon, description: "Upload event images and gallery" },
  { id: 4, title: "Date Selection", icon: Calendar, description: "Select dates for time slots" },
  { id: 5, title: "Time Slots", icon: Clock, description: "Create time slots for selected dates" },
  { id: 6, title: "Review & Submit", icon: CheckCircle, description: "Review all details before submitting" },
]

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<MyFormData>({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    location: "",
    postalCode: "",
    eventType: "",
    organizer: "",
    address: "",
    duration: "",
    language: "",
    ageRestriction: "",
    additionalInfo: "",
    tags: "",
    suburb:'',
    State:'',
    Country:'',
    mainImage: null,
    bannerImage: null,
    galleryImages: [],
    otherSubcategory: "",
    organizerName: "",
    organizerContact: "",
    organizerEmail: "",
    startDate: "",
    endDate: "",
    selectedDates: [],
    timeSlots: {},
    customCategories: [],
  })

  const [applyAllSlot, setApplyAllSlot] = useState<{
    startTime: string
    endTime: string
    capacity: number
    duration: string
    seatCategories: TicketCategory[]
  } | null>(null)
  const { userId } = useStore()
  const [showApplyAll, setShowApplyAll] = useState(false)
  const [activeDate, setActiveDate] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [categoriesToApply, setCategoriesToApply] = useState<TicketCategory[]>([])
  const [showCustomCategoryForm, setShowCustomCategoryForm] = useState(false)
  const [newCustomCategory, setNewCustomCategory] = useState({ name: "", price: 0 })
  const router = useRouter()

  const updateFormData = (field: keyof MyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getDatesBetween = (startDate: string, endDate: string): string[] => {
    const dates = []
    const start = new Date(startDate)
    const end = new Date(endDate)

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split("T")[0])
    }
    return dates
  }

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true)
    try {
      const response = await axiosInstance.get("/categories/list")
      setCategories(response.data.data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
    } finally {
      setIsLoadingCategories(false)
    }
  }, [])

  const fetchEventTypes = useCallback(async () => {
    setIsLoadingCategories(true)
    try {
      const response = await axiosInstance.get("/eventtype/active")
      setEventTypes(response.data.data || [])
    } catch (error) {
      console.error("Error fetching event types:", error)
      toast.error("Failed to load event types")
    } finally {
      setIsLoadingCategories(false)
    }
  }, [])

  const selectedCategory = formData.category
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat.category_id === selectedCategory)
      setSubcategories(category?.subcategories || [])
    } else {
      setSubcategories([])
    }
  }, [selectedCategory, categories])

  useEffect(() => {
    if (!userId) {
      toast.error("Please log in to create events")
      router.push("/")
      return
    }

    fetchCategories()
    fetchEventTypes()
  }, [userId, fetchCategories, fetchEventTypes])

  const toggleDateSelection = (date: string) => {
    const newSelectedDates = formData.selectedDates.includes(date)
      ? formData.selectedDates.filter((d) => d !== date)
      : [...formData.selectedDates, date]

    updateFormData("selectedDates", newSelectedDates)

    if (!activeDate && newSelectedDates.length > 0) {
      setActiveDate(newSelectedDates[0])
    }

    if (!newSelectedDates.includes(activeDate)) {
      setActiveDate(newSelectedDates[0] || "")
    }
  }

  const calculateDuration = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return ""

    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)

    if (end <= start) return ""

    const diffMs = end.getTime() - start.getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const addTimeSlot = (date: string) => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: {
        ...prev.timeSlots,
        [date]: [
          ...(prev.timeSlots[date] || []),
          {
            startTime: "",
            endTime: "",
            capacity: 0,
            duration: "",
            seatCategories: [],
          },
        ],
      },
    }))
  }

  const updateTimeSlot = (date: string, index: number, field: string, value: string | number) => {
    setFormData((prev) => {
      const updatedSlots = prev.timeSlots[date].map((slot, i) => {
        if (i === index) {
          const updatedSlot = { ...slot, [field]: value }

          if (field === "startTime" || field === "endTime") {
            updatedSlot.duration = calculateDuration(
              field === "startTime" ? (value as string) : slot.startTime,
              field === "endTime" ? (value as string) : slot.endTime,
            )
          }

          return updatedSlot
        }
        return slot
      })

      return {
        ...prev,
        timeSlots: {
          ...prev.timeSlots,
          [date]: updatedSlots,
        },
      }
    })
  }

  const addTicketCategoryToSlot = (date: string, slotIndex: number) => {
    setFormData((prev) => {
      const updatedSlots = [...prev.timeSlots[date]]
      const newCategory: TicketCategory = {
        id: Date.now().toString(),
        name: "",
        price: 0,
        quantity: 0,
      }
      updatedSlots[slotIndex] = {
        ...updatedSlots[slotIndex],
        seatCategories: [...updatedSlots[slotIndex].seatCategories, newCategory],
      }

      return {
        ...prev,
        timeSlots: {
          ...prev.timeSlots,
          [date]: updatedSlots,
        },
      }
    })
  }

  const updateTicketCategoryInSlot = (
    date: string,
    slotIndex: number,
    categoryId: string,
    field: keyof TicketCategory,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const updatedSlots = [...prev.timeSlots[date]]
      updatedSlots[slotIndex] = {
        ...updatedSlots[slotIndex],
        seatCategories: updatedSlots[slotIndex].seatCategories.map((cat) =>
          cat.id === categoryId ? { ...cat, [field]: value } : cat,
        ),
      }

      return {
        ...prev,
        timeSlots: {
          ...prev.timeSlots,
          [date]: updatedSlots,
        },
      }
    })
  }

  const removeTicketCategoryFromSlot = (date: string, slotIndex: number, categoryId: string) => {
    setFormData((prev) => {
      const updatedSlots = [...prev.timeSlots[date]]
      updatedSlots[slotIndex] = {
        ...updatedSlots[slotIndex],
        seatCategories: updatedSlots[slotIndex].seatCategories.filter((cat) => cat.id !== categoryId),
      }

      return {
        ...prev,
        timeSlots: {
          ...prev.timeSlots,
          [date]: updatedSlots,
        },
      }
    })
  }

  const handleFileUpload = (field: "mainImage" | "bannerImage", file: File | null) => {
    const preview = file ? URL.createObjectURL(file) : null
    updateFormData(field, file ? { file, preview } : null)
  }
function getCategoryName(id: string) {
  return categories.find(cat => cat.category_id === id)?.category_name || "Not provided";
}

function getSubcategoryName(id: string) {
  return subcategories.find(sub => sub.subcategory_id === id)?.subcategory_name || "Not provided";
}
function getEventTypeName(id: string) {
  return eventTypes.find(sub => sub.id === id)?.event_type || "Not provided";
}
  const addGalleryImage = (file: File) => {
    const preview = URL.createObjectURL(file)
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, { file, preview }],
    }))
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateEventSlug = (title: string): string => {
    return slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    })
  }

  const prepareExtraData = (formData: MyFormData) => {
    return JSON.stringify({
      description: formData.description,
      organizer: formData.organizer,
      address: formData.address+', '+formData.suburb+', '+formData.State+', '+formData.Country,
      duration: formData.duration || "",
      language: formData.language || "",
      postal_code: formData.postalCode,
      organizer_contact: formData.organizerContact,
      organizer_email: formData.organizerEmail,
      ageRestriction: formData.ageRestriction || "",
      additionalInfo: formData.additionalInfo || "",
    })
  }

  const prepareHashtags = (tags: string) => {
    if (!tags || tags.trim() === "") return JSON.stringify([])

    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))

    return JSON.stringify(tagArray)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.title &&
          formData.category &&
          formData.organizer &&
          formData.eventType &&
          formData.organizerEmail &&
          formData.organizerContact &&
          (formData.subcategory === "Other" ? formData.otherSubcategory : formData.subcategory)
        )
      case 2:
        return formData.description && formData.address && formData.startDate && formData.endDate
      case 3:
        return true
      case 4:
        return formData.selectedDates.length > 0
      case 5:
        return formData.selectedDates.every(
          (date) =>
            formData.timeSlots[date] &&
            formData.timeSlots[date].length > 0 &&
            formData.timeSlots[date].every((slot) => slot.startTime && slot.endTime),
        )
      case 6:
        return true
      default:
        return false
    }
  }

  const addCustomCategory = (name: string, price: number) => {
    setFormData((prev) => ({
      ...prev,
      customCategories: [...prev.customCategories, { name, price }],
    }))
  }

  function formatTime24to12(time: string) {
    const [h, m] = time.split(":").map(Number)
    const date = new Date()
    date.setHours(h, m)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  function formatDuration(start: string, end: string) {
    const [sh, sm] = start.split(":").map(Number)
    const [eh, em] = end.split(":").map(Number)

    const startMinutes = sh * 60 + sm
    const endMinutes = eh * 60 + em

    let diff = endMinutes - startMinutes
    if (diff < 0) diff += 24 * 60

    const hours = Math.floor(diff / 60)
    const minutes = diff % 60

    let result = ""
    if (hours > 0) result += `${hours} hour${hours > 1 ? "s" : ""}`
    if (minutes > 0) {
      if (result) result += " "
      result += `${minutes} minute${minutes > 1 ? "s" : ""}`
    }
    return result || "0 minutes"
  }

  function buildPayload(event_id: string, formData: any) {
    const slot_data: Record<string, any[]> = {}

    Object.entries(formData.timeSlots).forEach(([date, slots]: [string, any]) => {
      slot_data[date] = slots.map((slot: any, index: number) => {
        const formattedTime = formatTime24to12(slot.startTime)

        return {
          time: formattedTime,
          duration: formatDuration(slot.startTime, slot.endTime),
          seatCategories: slot.seatCategories.map((cat: any, catIndex: number) => {
            const cleanTime = slot.startTime.replace(":", "")
            return {
              id: `${cat.name.toLowerCase()}_${cleanTime}_${catIndex + 1}`,
              label: cat.name,
              price: cat.price,
              totalTickets: cat.quantity,
              booked: 0,
              held: 0,
              available: cat.quantity,
            }
          }),
        }
      })
    })

    return {
      event_ref_id: event_id,
      event_dates: formData.selectedDates,
      slot_data,
    }
  }

  const handleSubmit = async () => {
    try {
      const formsData = new FormData()
      formsData.append("user_id", userId.toString())
      formsData.append("event_title", formData.title)
      formsData.append("event_slug", generateEventSlug(formData.title))
      formsData.append("category_id", formData.category)
      formsData.append("event_type", formData.eventType || "")
      formsData.append("subcategory_id", formData.subcategory?.trim() || "")
      formsData.append("extra_data", prepareExtraData(formData))
      formsData.append("hash_tags", prepareHashtags(formData.tags || ""))
       formsData.append("custom_subcategory_name", formData.otherSubcategory || "")

      if (formData.mainImage?.file) {
        formsData.append("card_image", formData.mainImage.file)
      }

      if (formData.bannerImage?.file) {
        formsData.append("banner_image", formData.bannerImage.file)
      }

      const newGalleryImages = formData.galleryImages.filter((img) => img.file !== null)
      newGalleryImages.forEach((galleryImage) => {
        if (galleryImage.file) {
          formsData.append("extra_images", galleryImage.file)
        }
      })

      const response = await axiosInstance.post("/new-events/create-with-images", formsData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const event_id = response.data.data.event_id
      const api2Payload = buildPayload(event_id, formData)
      console.log("API 2 Payload:", api2Payload)
      const res2 = await axiosInstance.post("/new-slots/create", api2Payload)
      console.log("API 2 Response:", res2.data)
      toast.success("Event created successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Submission failed! Please try again.")
    } finally {
      router.push("/Events")
      setFormData({
        title: "",
        category: "",
        subcategory: "",
        description: "",
        location: "",
        postalCode: "",
        eventType: "",
        organizer: "",
        address: "",
        duration: "",
        language: "",
        ageRestriction: "",
        additionalInfo: "",
        tags: "",
        suburb: "",
        State: "",
        Country: "",
        mainImage: null,
        bannerImage: null,
        galleryImages: [],
        otherSubcategory: "",
        organizerName: "",
        organizerContact: "",
        organizerEmail: "",
        startDate: "",
        endDate: "",
        selectedDates: [],
        timeSlots: {},
        customCategories: [],
      })
    }
  }

  const applySlotToAllDates = () => {
    if (!applyAllSlot) return

    setFormData((prev) => {
      const newTimeSlots = { ...prev.timeSlots }

      prev.selectedDates.forEach((date) => {
        if (!newTimeSlots[date]) {
          newTimeSlots[date] = []
        }

        const alreadyExists = newTimeSlots[date].some(
          (slot) =>
            slot.startTime === applyAllSlot.startTime &&
            slot.endTime === applyAllSlot.endTime
        )

        if (!alreadyExists) {
          newTimeSlots[date].push({ ...applyAllSlot })
        }
      })

      return {
        ...prev,
        timeSlots: newTimeSlots,
      }
    })

    setApplyAllSlot(null)
    setShowApplyAll(false)
  }

  const createApplyAllTemplate = () => {
    if (currentStep === 4) {
      const activeDateSlots = formData.timeSlots[activeDate] || []
      const defaultSlot = activeDateSlots.length > 0
        ? {
            startTime: activeDateSlots[0].startTime,
            endTime: activeDateSlots[0].endTime,
            capacity: activeDateSlots[0].capacity || 0,
            duration: activeDateSlots[0].duration || "0h 0m",
            seatCategories: activeDateSlots[0].seatCategories || [],
          }
        : {
            startTime: "",
            endTime: "",
            capacity: 0,
            duration: "0h 0m",
            seatCategories: [],
          }
      setApplyAllSlot(defaultSlot)
    } else if (currentStep === 5) {
      setCategoriesToApply([])
    }
    setShowApplyAll(true)
  }

  const applyCategoriesToAllSlots = () => {
    if (categoriesToApply.length === 0) return

    setFormData((prev) => {
      const newTimeSlots = { ...prev.timeSlots }

      prev.selectedDates.forEach((date) => {
        if (newTimeSlots[date]) {
          newTimeSlots[date] = newTimeSlots[date].map(slot => ({
            ...slot,
            seatCategories: [...slot.seatCategories, ...categoriesToApply.map(cat => ({
              ...cat,
              id: `${cat.id}_${Date.now()}_${Math.random()}`
            }))]
          }))
        }
      })

      return {
        ...prev,
        timeSlots: newTimeSlots,
      }
    })

    setCategoriesToApply([])
    setShowApplyAll(false)
  }

  const updateApplyAllSlot = (field: string, value: string | number) => {
    if (!applyAllSlot) return

    setApplyAllSlot((prev) => {
      if (!prev) return null

      const updatedSlot = { ...prev, [field]: value }

      if (field === "startTime" || field === "endTime") {
        updatedSlot.duration = calculateDuration(
          field === "startTime" ? (value as string) : prev.startTime,
          field === "endTime" ? (value as string) : prev.endTime,
        )
      }

      return updatedSlot
    })
  }

  const addCategoryToApplyAll = () => {
    if (!applyAllSlot) return

    const newCategory: TicketCategory = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      quantity: 0,
    }

    setApplyAllSlot((prev) => {
      if (!prev) return null
      return {
        ...prev,
        seatCategories: [...prev.seatCategories, newCategory],
      }
    })
  }

  const updateApplyAllCategory = (categoryId: string, field: keyof TicketCategory, value: string | number) => {
    if (!applyAllSlot) return

    setApplyAllSlot((prev) => {
      if (!prev) return null
      return {
        ...prev,
        seatCategories: prev.seatCategories.map((cat) =>
          cat.id === categoryId ? { ...cat, [field]: value } : cat,
        ),
      }
    })
  }

  const removeCategoryFromApplyAll = (categoryId: string) => {
    if (!applyAllSlot) return

    setApplyAllSlot((prev) => {
      if (!prev) return null
      return {
        ...prev,
        seatCategories: prev.seatCategories.filter((cat) => cat.id !== categoryId),
      }
    })
  }

  const removeTimeSlot = (date: string, index: number) => {
    setFormData((prev) => {
      const updatedTimeSlots = { ...prev.timeSlots }
      updatedTimeSlots[date] = updatedTimeSlots[date].filter((_, i) => i !== index)

      return {
        ...prev,
        timeSlots: updatedTimeSlots,
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
          <p className="text-gray-600 mb-6">Fill in the details to create your event</p>

          <div className="w-full mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2 bg-gray-100 w-full" />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between max-w-full mx-auto overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep
              const isAccessible = step.id <= currentStep

              return (
                <div key={step.id} className="flex items-center flex-1 min-w-0">
                  <div
                    className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                      isAccessible ? "hover:scale-105" : ""
                    }`}
                    onClick={() => isAccessible && setCurrentStep(step.id)}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        isActive
                          ? "bg-blue-500 text-white shadow-lg"
                          : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <div className="text-center max-w-32">
                      <h3
                        className={`font-semibold text-sm mb-1 ${
                          isActive ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-tight">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${step.id < currentStep ? "bg-green-300" : "bg-gray-200"}`}
                    ></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{steps.find((s) => s.id === currentStep)?.title}</CardTitle>
                <p className="text-gray-600">{steps.find((s) => s.id === currentStep)?.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{currentStep}</div>
                <div className="text-sm text-gray-500">of {steps.length}</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in-50 duration-500 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventType" className="text-sm font-medium text-gray-700">
                      Event Type *
                    </Label>
                    <Select
                      value={formData.eventType}
                      onValueChange={(value) => {
                        updateFormData("eventType", value)
                        updateFormData("subcategory", "")
                        updateFormData("otherSubcategory", "")
                      }}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.event_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Event Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateFormData("title", e.target.value)}
                      placeholder="Enter event title"
                      className="h-10 w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Category *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.category_id} value={category.category_id}>
                            {category.category_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategory" className="text-sm font-medium text-gray-700">
                      Event Subcategory *
                    </Label>
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) => updateFormData("subcategory", value)}
                      disabled={!formData.eventType}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((sub) => (
                          <SelectItem key={sub.subcategory_id} value={sub.subcategory_id}>
                            {sub.subcategory_name}
                          </SelectItem>
                        ))}
              
                      </SelectContent>
                    </Select>
                 {formData.subcategory && subcategories.find(cat=>cat.subcategory_id===formData.subcategory)?.subcategory_name==='Others' && (
                      <Input
                        id="otherSubcategory"
                        value={formData.otherSubcategory || ""}
                        onChange={(e) => updateFormData("otherSubcategory", e.target.value)}
                        placeholder="Enter custom subcategory"
                        className="h-10 w-full mt-2"
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizer" className="text-sm font-medium text-gray-700">
                      Organizer *
                    </Label>
                    <Input
                      id="organizer"
                      value={formData.organizer}
                      onChange={(e) => updateFormData("organizer", e.target.value)}
                      placeholder="Enter organizer name"
                      className="h-10 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizerContact" className="text-sm font-medium text-gray-700">
                      Contact Number *
                    </Label>
                    <Input
                      id="organizerContact"
                      type="tel"
                      value={formData.organizerContact}
                      onChange={(e) => updateFormData("organizerContact", e.target.value)}
                      placeholder="Enter contact number"
                      className="h-10 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizerEmail" className="text-sm font-medium text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="organizerEmail"
                      type="email"
                      value={formData.organizerEmail}
                      onChange={(e) => updateFormData("organizerEmail", e.target.value)}
                      placeholder="Enter email address"
                      className="h-10 w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in-50 duration-500 h-full overflow-auto">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Event Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Provide a detailed description of your event"
                    rows={4}
                    className="text-sm"
                  />
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Venue Location *
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Full address including city, state"
                    className="h-10"
                  />
                </div>
            
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                   suburb *
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.suburb}
                    onChange={(e) => updateFormData("suburb", e.target.value)}
                    placeholder="Enter postal code"
                    className="h-10"
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                   State *
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.State}
                    onChange={(e) => updateFormData("State", e.target.value)}
                    placeholder="Enter postal code"
                    className="h-10"
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
             Country
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.Country}
                    onChange={(e) => updateFormData("Country", e.target.value)}
                    placeholder="Enter postal code"
                    className="h-10"
                  />
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData("startDate", e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                      End Date *
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateFormData("endDate", e.target.value)}
                      min={formData.startDate}
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                      Language
                    </Label>
                    <Input
                      id="language"
                      value={formData.language}
                      onChange={(e) => updateFormData("language", e.target.value)}
                      placeholder="e.g., English"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageRestriction" className="text-sm font-medium text-gray-700">
                      Age Restriction
                    </Label>
                    <Input
                      id="ageRestriction"
                      value={formData.ageRestriction}
                      onChange={(e) => updateFormData("ageRestriction", e.target.value)}
                      placeholder="e.g., 18+"
                      className="h-10"
                    />
                  </div>
                    <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => updateFormData("tags", e.target.value)}
                    placeholder="Comma-separated tags"
                    className="h-10"
                  />
                </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
                    Additional Information
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                    placeholder="Any special requirements or details"
                    rows={3}
                    className="text-sm"
                  />
                </div>
         
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in-50 duration-500 h-full overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="space-y-3">
  <Label className="text-sm font-medium text-gray-700">Main Card Image</Label>

  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors h-40 flex items-center justify-center">
    {!formData.mainImage?.preview ? (
      // Upload UI
      <div>
        <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-2">Upload Main Image</p>
        <p className="text-xs text-gray-500 mb-3">For event cards</p>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload("mainImage", e.target.files?.[0] || null)}
          className="text-xs"
        />
      </div>
    ) : (
      // Preview inside card
      <>
        <img
          src={formData.mainImage.preview}
          alt="Main Image Preview"
          className="w-full h-full object-cover rounded-lg"
        />
        <Button
          size="sm"
          variant="destructive"
          className="absolute top-2 right-2 h-6 w-6 rounded-full p-0"
          onClick={() => handleFileUpload("mainImage", null)}
        >
          <X className="w-4 h-4" />
        </Button>
      </>
    )}
  </div>
</div>


 {/* Banner Image */}
<div className="space-y-3">
  <Label className="text-sm font-medium text-gray-700">Banner Image</Label>

  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors h-40 flex items-center justify-center">
    {!formData.bannerImage?.preview ? (
      // Upload UI
      <div>
        <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-2">Upload Banner</p>
        <p className="text-xs text-gray-500 mb-3">Wide banner image</p>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload("bannerImage", e.target.files?.[0] || null)}
          className="text-xs"
        />
      </div>
    ) : (
      // Preview UI
      <>
        <img
          src={formData.bannerImage.preview}
          alt="Banner Image Preview"
          className="w-full h-full object-cover rounded-lg"
        />
        <Button
          size="sm"
          variant="destructive"
          className="absolute top-2 right-2 h-6 w-6 rounded-full p-0"
          onClick={() => handleFileUpload("bannerImage", null)}
        >
          <X className="w-4 h-4" />
        </Button>
      </>
    )}
  </div>
</div>


{/* Main Card Image */}



                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Gallery Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                    <div className="w-10 h-10 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Upload Gallery</p>
                    <p className="text-xs text-gray-500 mb-2">Multiple images</p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        files.forEach((file) => addGalleryImage(file))
                      }}
                      className="text-xs"
                    />
                  </div>
                  {formData.galleryImages.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-auto">
                      {formData.galleryImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img.preview || "/placeholder.svg"}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-16 object-cover rounded-lg shadow-sm"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in-50 duration-500 h-full">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Dates & Create Time Slots</h3>
                  <p className="text-gray-600">Choose dates and create time slots for your event</p>
                </div>
                {formData.startDate && formData.endDate ? (
                  <div className="flex gap-6 h-[600px]">
                    <div className="w-80 bg-white rounded-xl border border-gray-200 p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Dates</h4>
                      <div className="grid grid-cols-7 gap-1 mb-3">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                          <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {(() => {
                          const dates = getDatesBetween(formData.startDate, formData.endDate)
                          const startDate = new Date(dates[0])
                          const startDay = startDate.getDay()
                          const calendarDates = []

                          for (let i = 0; i < startDay; i++) {
                            calendarDates.push(<div key={`empty-${i}`} className="h-8"></div>)
                          }

                          dates.forEach((date) => {
                            const isSelected = formData.selectedDates.includes(date)
                            const dateObj = new Date(date)
                            const dayNumber = dateObj.getDate()

                            calendarDates.push(
                              <div
                                key={date}
                                onClick={() => toggleDateSelection(date)}
                                className={`h-8 flex items-center justify-center rounded cursor-pointer transition-all duration-200 text-xs ${
                                  isSelected ? "bg-blue-500 text-white" : "hover:bg-blue-50 text-gray-700"
                                }`}
                              >
                                {dayNumber}
                              </div>,
                            )
                          })

                          return calendarDates
                        })()}
                      </div>
                      {formData.selectedDates.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-900 mb-2">
                            {formData.selectedDates.length} date{formData.selectedDates.length > 1 ? "s" : ""} selected
                          </div>
                          <div className="text-xs text-blue-700">Click on dates to select/deselect</div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 overflow-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Time Slots</h4>
                        {formData.selectedDates.length > 1 && (
                          <Button
                            type="button"
                            onClick={createApplyAllTemplate}
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                          >
                            Apply to All Dates
                          </Button>
                        )}
                      </div>
                      {formData.selectedDates.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <div className="text-lg mb-2">No dates selected</div>
                          <div className="text-sm">Select dates from the calendar to create time slots</div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-1 border-b border-gray-200">
                            {formData.selectedDates.map((date) => {
                              const dateObj = new Date(date)
                              const formattedDate = dateObj.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                              const isActive = activeDate === date

                              return (
                                <button
                                  key={date}
                                  type="button"
                                  onClick={() => setActiveDate(date)}
                                  className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                                    isActive
                                      ? "bg-blue-500 text-white border-b-2 border-blue-500"
                                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                  }`}
                                >
                                  {formattedDate}
                                  {formData.timeSlots[date]?.length > 0 && (
                                    <span className="ml-1 text-xs bg-white bg-opacity-20 px-1 rounded">
                                      {formData.timeSlots[date].length}
                                    </span>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                          {activeDate && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-gray-900">
                                  {new Date(activeDate).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </h5>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addTimeSlot(activeDate)}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                  Add Time Slot
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {(formData.timeSlots[activeDate] || []).map((slot, index) => (
                                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="flex items-center gap-2">
                                        <div className="space-y-1">
                                          <Label className="text-xs font-medium text-gray-700">Start Time</Label>
                                          <Input
                                            type="time"
                                            value={slot.startTime}
                                            onChange={(e) =>
                                              updateTimeSlot(activeDate, index, "startTime", e.target.value)
                                            }
                                            className="h-9 w-30"
                                          />
                                        </div>
                                        <span className="text-gray-400 text-sm mt-6">to</span>
                                        <div className="space-y-1">
                                          <Label className="text-xs font-medium text-gray-700">End Time</Label>
                                          <Input
                                            type="time"
                                            value={slot.endTime}
                                            onChange={(e) =>
                                              updateTimeSlot(activeDate, index, "endTime", e.target.value)
                                            }
                                            className="h-9 w-30"
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs font-medium text-gray-700">Duration</Label>
                                        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded border h-9 flex items-center min-w-[80px]">
                                          {slot.duration || "0h 0m"}
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeTimeSlot(activeDate, index)}
                                      className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                {(!formData.timeSlots[activeDate] || formData.timeSlots[activeDate].length === 0) && (
                                  <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                                    No time slots yet. Click "Add Time Slot" to create one.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Please set start and end dates in the Event Details step first.</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in-50 duration-500 h-full overflow-auto">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Categories & Pricing</h3>
                  <p className="text-gray-600">Set ticket categories and pricing for your time slots</p>
                </div>
                <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
                  <div className="w-80 bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Dates</h4>
                    <div className="grid grid-cols-7 gap-1 mb-3">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                        <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {(() => {
                        const dates = getDatesBetween(formData.startDate, formData.endDate)
                        const startDate = new Date(dates[0])
                        const startDay = startDate.getDay()
                        const calendarDates = []

                        for (let i = 0; i < startDay; i++) {
                          calendarDates.push(<div key={`empty-${i}`} className="h-8"></div>)
                        }

                        dates.forEach((date) => {
                          const isSelected = formData.selectedDates.includes(date)
                          const dateObj = new Date(date)
                          const dayNumber = dateObj.getDate()

                          calendarDates.push(
                            <div
                              key={date}
                              onClick={() => toggleDateSelection(date)}
                              className={`h-8 flex items-center justify-center rounded cursor-pointer transition-all duration-200 text-xs ${
                                isSelected ? "bg-blue-500 text-white" : "hover:bg-blue-50 text-gray-700"
                              }`}
                            >
                              {dayNumber}
                            </div>,
                          )
                        })

                        return calendarDates
                      })()}
                    </div>
                    {formData.selectedDates.length > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-2">
                          {formData.selectedDates.length} date{formData.selectedDates.length > 1 ? "s" : ""} selected
                        </div>
                        <div className="text-xs text-blue-700">Click on dates to select/deselect</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Categories And Pricing</h4>
                      {formData.selectedDates?.length > 1 && (
                        <Button
                          type="button"
                          onClick={createApplyAllTemplate}
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                        >
                          Apply to All Slots
                        </Button>
                      )}
                    </div>
                    {formData.selectedDates?.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <div className="text-lg mb-2">No dates selected</div>
                        <div className="text-sm">Select dates from the calendar to set categories and pricing</div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1 border-b border-gray-200">
                          {formData.selectedDates.map((date) => {
                            const dateObj = new Date(date)
                            const formattedDate = dateObj.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                            const isActive = activeDate === date

                            return (
                              <button
                                key={date}
                                type="button"
                                onClick={() => setActiveDate(date)}
                                className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                                  isActive
                                    ? "bg-blue-500 text-white border-b-2 border-blue-500"
                                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                }`}
                              >
                                {formattedDate}
                                {formData.timeSlots[date]?.length > 0 && (
                                  <span className="ml-1 text-xs bg-white bg-opacity-20 px-1 rounded">
                                    {formData.timeSlots[date].length}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                        {activeDate && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900">
                                {new Date(activeDate).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </h5>
                            </div>
                            <div className="space-y-3">
                              {(formData.timeSlots[activeDate] || []).map((slot, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="text-sm font-medium text-gray-700">
                                      {slot.startTime} - {slot.endTime}
                                      <div className="text-xs text-gray-500">{slot.duration}</div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <h6 className="text-sm font-medium text-gray-800">Ticket Categories</h6>
                                      <Button
                                        type="button"
                                        onClick={() => addTicketCategoryToSlot(activeDate, index)}
                                        variant="outline"
                                        size="sm"
                                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                      >
                                        + Add Category
                                      </Button>
                                    </div>
                                    {slot.seatCategories?.length === 0 ? (
                                      <div className="text-center py-3 text-gray-500 text-sm">
                                        No ticket categories added. Click "Add Category" to get started.
                                      </div>
                                    ) : (
                                      <div className="space-y-2">
                                        {slot.seatCategories?.map((category) => (
                                          <div
                                            key={category.id}
                                            className="grid grid-cols-4 gap-3 items-center p-3 bg-white rounded border"
                                          >
                                            <div className="space-y-1">
                                              <Label className="text-xs font-medium text-gray-700">Category Name</Label>
                                              <Input
                                                type="text"
                                                value={category.name}
                                                onChange={(e) =>
                                                  updateTicketCategoryInSlot(
                                                    activeDate,
                                                    index,
                                                    category.id,
                                                    "name",
                                                    e.target.value,
                                                  )
                                                }
                                                className="h-8"
                                                placeholder="e.g., VIP, General"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <Label className="text-xs font-medium text-gray-700">Price ($)</Label>
                                              <Input
                                                type="number"
                                                value={category.price}
                                                onChange={(e) =>
                                                  updateTicketCategoryInSlot(
                                                    activeDate,
                                                    index,
                                                    category.id,
                                                    "price",
                                                    Number(e.target.value) || 0,
                                                  )
                                                }
                                                className="h-8"
                                                min="0"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <Label className="text-xs font-medium text-gray-700">Quantity</Label>
                                              <Input
                                                type="number"
                                                value={category.quantity}
                                                onChange={(e) =>
                                                  updateTicketCategoryInSlot(
                                                    activeDate,
                                                    index,
                                                    category.id,
                                                    "quantity",
                                                    Number(e.target.value) || 0,
                                                  )
                                                }
                                                className="h-8"
                                                min="0"
                                              />
                                            </div>
                                            <div className="flex items-end justify-between">
                                              <div className="text-xs text-gray-600">
                                                Revenue: ${(category.price * category.quantity).toLocaleString()}
                                              </div>
                                              <Button
                                                type="button"
                                                onClick={() => removeTicketCategoryFromSlot(activeDate, index, category.id)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                              >
                                                ×
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {slot.seatCategories.length > 0 && (
                                      <div className="text-sm font-medium text-gray-700 bg-blue-50 p-2 rounded">
                                        Total Slot Revenue: $
                                        {slot.seatCategories
                                          .reduce((sum, cat) => sum + cat.price * cat.quantity, 0)
                                          .toLocaleString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {(!formData.timeSlots[activeDate] || formData.timeSlots[activeDate].length === 0) && (
                                <div className="text-center py-4 text-gray-500">No time slots created for this date.</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              
              <div className="space-y-8 animate-in fade-in-50 duration-500">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Your Event</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Title:</span> {formData.title || "Not provided"}
                          </p>
                          <p>
                            <span className="font-medium">Category:</span> {getCategoryName(formData.category) || "Not provided"}
                          </p>
                          <p>
                            <span className="font-medium">Subcategory:</span>{" "}
                            {getSubcategoryName( formData.subcategory) || "Not provided"}
                          </p>
                          <p>
                            <span className="font-medium">Organizer:</span> {formData.organizer || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Organizer Details</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Name:</span> {formData.organizer || "Not provided"}
                          </p>
                          <p>
                            <span className="font-medium">Contact:</span> {formData.organizerContact || "Not provided"}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span> {formData.organizerEmail || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Location & Details</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Address:</span> {formData.address || "Not provided"}
                          </p>
                          <p>
                            <span className="font-medium">Start Date:</span> {formData.startDate || "Not provided"}
                          </p>
                          <p>
                            <span className="font-medium">End Date:</span> {formData.endDate || "Not provided"}
                          </p>
                          <p>
                            <span className="font-medium">Duration:</span> {formData.duration || "Not specified"}
                          </p>
                          <p>
                            <span className="font-medium">Language:</span> {formData.language || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Media & Content</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Main Image:</span>{" "}
                            {formData.mainImage?.file ? "✓ Uploaded" : "Not uploaded"}
                          </p>
                          <p>
                            <span className="font-medium">Banner Image:</span>{" "}
                            {formData.bannerImage?.file ? "✓ Uploaded" : "Not uploaded"}
                          </p>
                          <p>
                            <span className="font-medium">Gallery Images:</span> {formData.galleryImages.length}{" "}
                            uploaded
                          </p>
                          <p>
                            <span className="font-medium">Age Restriction:</span> {formData.ageRestriction || "None"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                        <p className="text-sm">{formData.tags || "No tags added"}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Time Slots</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Selected Dates:</span> {formData.selectedDates.length}
                          </p>
                          <p>
                            <span className="font-medium">Total Slots:</span>{" "}
                            {Object.values(formData.timeSlots).reduce((total, slots) => total + slots.length, 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {formData.description && (
                    <div className="bg-white rounded-lg p-4 mt-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{formData.description}</p>
                    </div>
                  )}
                  {formData.selectedDates.length > 0 && (
                    <div className="bg-white rounded-lg p-4 mt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Time Slots Details</h4>
                      <div className="space-y-4">
                        {formData.selectedDates.map((date) => (
                          <div key={date} className="border-l-4 border-blue-500 pl-4">
                            <h5 className="font-medium text-gray-900 mb-2">
                              {new Date(date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </h5>
                            <div className="space-y-1">
                              {(formData.timeSlots[date] || []).map((slot, index) => (
                                <div
      key={index}
      className="border rounded-lg p-3 bg-gray-50 shadow-sm"
    >
      <p className="text-sm font-medium text-gray-800">
        {slot.startTime} – {slot.endTime}
      </p>
      <div className="mt-2 text-sm text-gray-600">
        <span className="font-semibold">Seat Categories:</span>{" "}
        {slot.seatCategories?.length > 0 ? (
          <ul className="list-disc list-inside mt-1 space-y-1">
            {slot.seatCategories.map((cat) => (
              <li key={cat.id}>
                {cat.name} (${cat.price} × {cat.quantity})
              </li>
            ))}
          </ul>
        ) : (
          <span>No categories</span>
        )}
      </div>
    </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <Info className="w-6 h-6 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Before You Submit</h4>
                      <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                        <li>• Double-check all information is accurate</li>
                        <li>• Ensure images are properly uploaded</li>
                        <li>• Review event description for clarity</li>
                        <li>• Verify contact and location details</li>
                        <li>• Confirm time slots and capacities are correct</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-8 justify-end">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="h-12 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={nextStep} disabled={!isStepValid()} className="h-12 bg-blue-600 hover:bg-blue-700">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="h-12 bg-green-600 hover:bg-green-700">
              Submit Event
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
      {currentStep === 4 && showApplyAll && applyAllSlot && (
        <TimeSlotPopup
          applyAllSlot={applyAllSlot}
          setApplyAllSlot={setApplyAllSlot}
          applyToAllDates={applySlotToAllDates}
          updateApplyAllSlot={updateApplyAllSlot}
          setShowApplyAll={setShowApplyAll}
        />
      )}
      {currentStep === 5 && showApplyAll && (
        <CategoryPricingPopup
          categories={categoriesToApply}
          setCategories={setCategoriesToApply}
          applyToAllSlots={applyCategoriesToAllSlots}
          setShowApplyAll={setShowApplyAll}
        />
      )}
    </div>
  )
}

