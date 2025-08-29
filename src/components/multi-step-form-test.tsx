"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, CheckCircle, Calendar, Clock, ImageIcon, Info, MapPin } from "lucide-react"
import useStore from "@/lib/Zustand"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import slugify from "slugify"
import axiosInstance from "@/lib/axiosinstance"
import BasicInformation from "../components/Event/BasicInfo"
import EventDetails from "./Event/EventDetails"
import ImagesMedia from "../components/Event/Media"
import DateSelection from "../components/Event/Dates"
import TimeSlots from "../components/Event/Slots"
import ReviewSubmit from "../components/Event/review"
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

interface EventType {
  id: string
  type_id: string
  event_type: string
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
  const router = useRouter()

  const updateFormData = (field: keyof MyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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

  useEffect(() => {
    if (formData.category) {
      const category = categories.find((cat) => cat.category_id === formData.category)
      setSubcategories(category?.subcategories || [])
    } else {
      setSubcategories([])
    }
  }, [formData.category, categories])

  useEffect(() => {
    if (!userId) {
      toast.error("Please log in to create events")
      router.push("/")
      return
    }

    fetchCategories()
    fetchEventTypes()
  }, [userId, fetchCategories, fetchEventTypes])

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

  const getDatesBetween = (startDate: string, endDate: string): string[] => {
    const dates = []
    const start = new Date(startDate)
    const end = new Date(endDate)

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split("T")[0])
    }
    return dates
  }

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

  const formatTime24to12 = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    const date = new Date()
    date.setHours(h, m)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDuration = (start: string, end: string) => {
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

  const buildPayload = (event_id: string, formData: MyFormData) => {
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
      formsData.append("event_slug", slugify(formData.title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      }))
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
              <BasicInformation
                formData={formData}
                updateFormData={updateFormData}
                categories={categories}
                subcategories={subcategories}
                eventTypes={eventTypes}
                isLoadingCategories={isLoadingCategories}
              />
            )}
            {currentStep === 2 && (
              <EventDetails
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
            {currentStep === 3 && (
              <ImagesMedia
                formData={formData}
                handleFileUpload={handleFileUpload}
                addGalleryImage={addGalleryImage}
                removeGalleryImage={removeGalleryImage}
              />
            )}
            {currentStep === 4 && (
              <DateSelection
                formData={formData}
                activeDate={activeDate}
                setActiveDate={setActiveDate}
                toggleDateSelection={toggleDateSelection}
                getDatesBetween={getDatesBetween}
                addTimeSlot={addTimeSlot}
                updateTimeSlot={updateTimeSlot}
                removeTimeSlot={removeTimeSlot}
                createApplyAllTemplate={createApplyAllTemplate}
              />
            )}
            {currentStep === 5 && (
              <TimeSlots
                formData={formData}
                activeDate={activeDate}
                setActiveDate={setActiveDate}
                toggleDateSelection={toggleDateSelection}
                getDatesBetween={getDatesBetween}
                addTicketCategoryToSlot={addTicketCategoryToSlot}
                updateTicketCategoryInSlot={updateTicketCategoryInSlot}
                removeTicketCategoryFromSlot={removeTicketCategoryFromSlot}
                createApplyAllTemplate={createApplyAllTemplate}
              />
            )}
            {currentStep === 6 && (
              <ReviewSubmit
                formData={formData}
                categories={categories}
                subcategories={subcategories}
                eventTypes={eventTypes}
              />
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