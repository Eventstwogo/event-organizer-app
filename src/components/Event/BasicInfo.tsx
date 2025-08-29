import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface MyFormData {
  title: string
  category: string
  subcategory: string
  eventType: string
  organizer: string
  organizerContact: string
  organizerEmail: string
  otherSubcategory?: string
}

interface BasicInformationProps {
  formData: MyFormData
  updateFormData: (field: keyof MyFormData, value: any) => void
  categories: Category[]
  subcategories: Subcategory[]
  eventTypes: EventType[]
  isLoadingCategories: boolean
}

export default function BasicInformation({
  formData,
  updateFormData,
  categories,
  subcategories,
  eventTypes,
  isLoadingCategories,
}: BasicInformationProps) {
  return (
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
            disabled={isLoadingCategories}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.id} value={type.type_id}>
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
          <Select
            value={formData.category}
            onValueChange={(value) => updateFormData("category", value)}
            disabled={isLoadingCategories}
          >
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
            disabled={!formData.eventType || isLoadingCategories}
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
          {formData.subcategory && subcategories.find(cat => cat.subcategory_id === formData.subcategory)?.subcategory_name === 'Others' && (
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
  )
}