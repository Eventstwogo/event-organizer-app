import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface MyFormData {
  description: string
  address: string
  postalCode: string
  startDate: string
  endDate: string
  language: string
  ageRestriction: string
  tags: string
  additionalInfo: string
  suburb: string
  State: string
  Country: string
}

interface EventDetailsProps {
  formData: MyFormData
  updateFormData: (field: keyof MyFormData, value: any) => void
}

export default function EventDetails({ formData, updateFormData }: EventDetailsProps) {
  return (
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
          <Label htmlFor="suburb" className="text-sm font-medium text-gray-700">
            Suburb *
          </Label>
          <Input
            id="suburb"
            value={formData.suburb}
            onChange={(e) => updateFormData("suburb", e.target.value)}
            placeholder="Enter suburb"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="State" className="text-sm font-medium text-gray-700">
            State *
          </Label>
          <Input
            id="State"
            value={formData.State}
            onChange={(e) => updateFormData("State", e.target.value)}
            placeholder="Enter state"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="Country" className="text-sm font-medium text-gray-700">
            Country *
          </Label>
          <Input
            id="Country"
            value={formData.Country}
            onChange={(e) => updateFormData("Country", e.target.value)}
            placeholder="Enter country"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
            Postal Code *
          </Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => updateFormData("postalCode", e.target.value)}
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
  )
}