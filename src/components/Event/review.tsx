import { Info } from "lucide-react";

interface TimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
  duration: string;
  seatCategories: TicketCategory[];
}

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Category {
  category_id: string;
  category_name: string;
  category_slug: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  subcategory_id: string;
  subcategory_name: string;
  subcategory_slug: string;
}

interface EventType {
  id: string;
  type_id: string;
  event_type: string;
}

interface MyFormData {
  title: string;
  category: string;
  subcategory: string;
  description: string;
  location: string;
  postalCode: string;
  eventType: string;
  organizer: string;
  address: string;
  duration: string;
  language: string;
  ageRestriction: string;
  additionalInfo: string;
  tags: string;
  mainImage: { file?: File; url?: string; preview?: string } | null;
  bannerImage: { file?: File; url?: string; preview?: string } | null;
  galleryImages: { file?: File; url?: string; preview?: string }[];
  otherSubcategory?: string;
  organizerName: string;
  organizerContact: string;
  organizerEmail: string;
  startDate: string;
  endDate: string;
  selectedDates: string[];
  timeSlots: { [date: string]: TimeSlot[] };
  customCategories: { name: string; price: number }[];
  suburb: string;
  State: string;
  Country: string;
}

interface ReviewSubmitProps {
  formData: MyFormData;
  categories: Category[];
  subcategories: Subcategory[];
  eventTypes: EventType[];
  editmode: boolean;
  editslotmode: boolean;
}

export default function ReviewSubmit({
  formData,
  categories,
  subcategories,
  eventTypes,
  editmode,
  editslotmode,
}: ReviewSubmitProps) {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.category_id === categoryId);
    return category ? category.category_name : "N/A";
  };

  const getSubcategoryName = (subcategoryId: string) => {
    if (subcategoryId === "Other" && formData.otherSubcategory) {
      return formData.otherSubcategory;
    }
    const subcategory = subcategories.find((sub) => sub.subcategory_id === subcategoryId);
    return subcategory ? subcategory.subcategory_name : "N/A";
  };

  const getEventTypeName = (typeId: string) => {
    const eventType = eventTypes.find((type) => type.type_id === typeId);
    return eventType ? eventType.event_type : "N/A";
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 h-full overflow-auto">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Your Event</h3>
        <p className="text-gray-600">Please review all details before submitting your event.</p>
      </div>

      <div className="space-y-6">
        {/* Basic Information - Shown in editmode or create mode, not in editslotmode */}
        {!editslotmode && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Event Title</p>
                <p className="text-gray-900">{formData.title || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Event Type</p>
                <p className="text-gray-900">{getEventTypeName(formData.eventType)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Category</p>
                <p className="text-gray-900">{getCategoryName(formData.category)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Subcategory</p>
                <p className="text-gray-900">{getSubcategoryName(formData.subcategory)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Organizer</p>
                <p className="text-gray-900">{formData.organizer || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Contact</p>
                <p className="text-gray-900">{formData.organizerContact || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-900">{formData.organizerEmail || "Not provided"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Event Details - Shown in editmode or create mode, not in editslotmode */}
        {!editslotmode && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              Event Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Description</p>
                <p className="text-gray-900">{formData.description || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Address</p>
                <p className="text-gray-900">
                  {formData.address && formData.suburb && formData.State && formData.Country
                    ? `${formData.address}, ${formData.suburb}, ${formData.State}, ${formData.Country}`
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Postal Code</p>
                <p className="text-gray-900">{formData.postalCode || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Start Date</p>
                <p className="text-gray-900">
                  {formData.startDate
                    ? new Date(formData.startDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">End Date</p>
                <p className="text-gray-900">
                  {formData.endDate
                    ? new Date(formData.endDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Language</p>
                <p className="text-gray-900">{formData.language || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Age Restriction</p>
                <p className="text-gray-900">{formData.ageRestriction || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Tags</p>
                <p className="text-gray-900">{formData.tags || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Additional Info</p>
                <p className="text-gray-900">{formData.additionalInfo || "Not provided"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Images & Media - Shown in editmode or create mode, not in editslotmode */}
        {!editslotmode && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              Images & Media
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Main Image</p>
                {formData.mainImage?.preview ? (
                  <img
                    src={formData.mainImage.preview}
                    alt="Main Image"
                    className="w-32 h-32 object-cover rounded-lg mt-2"
                  />
                ) : (
                  <p className="text-gray-900">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Banner Image</p>
                {formData.bannerImage?.preview ? (
                  <img
                    src={formData.bannerImage.preview}
                    alt="Banner Image"
                    className="w-64 h-24 object-cover rounded-lg mt-2"
                  />
                ) : (
                  <p className="text-gray-900">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Gallery Images</p>
                {formData.galleryImages.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {formData.galleryImages.map((img, index) => (
                      <img
                        key={index}
                        src={img.preview}
                        alt={`Gallery Image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-900">Not provided</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dates & Time Slots - Shown in editslotmode or create mode, not in editmode */}
        {(!editmode || editslotmode) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              Dates & Time Slots
            </h4>
            {formData.selectedDates.length > 0 ? (
              <div className="space-y-4">
                {formData.selectedDates.map((date) => (
                  <div key={date} className="border-b border-gray-200 pb-4">
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <div className="mt-2 space-y-2 flex gap-3 felx-nowrap">
                      {(formData.timeSlots[date] || []).map((slot, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">
                            {slot.startTime} - {slot.endTime} ({slot.duration})
                          </p>
                          {slot.seatCategories.length > 0 ? (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Ticket Categories:</p>
                              <ul className="list-disc list-inside text-sm text-gray-900">
                                {slot.seatCategories.map((cat) => (
                                  <li key={cat.id}>
                                    {cat.name}: ${cat.price} x {cat.quantity} tickets = $
                                    {(cat.price * cat.quantity).toLocaleString()}
                                  </li>
                                ))}
                              </ul>
                              <p className="text-sm font-medium text-gray-700 mt-2">
                                Total Slot Revenue: $
                                {slot.seatCategories
                                  .reduce((sum, cat) => sum + cat.price * cat.quantity, 0)
                                  .toLocaleString()}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">No ticket categories added</p>
                          )}
                        </div>
                      ))}
                      {(!formData.timeSlots[date] || formData.timeSlots[date].length === 0) && (
                        <p className="text-sm text-gray-600">No time slots added</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-900">No dates selected</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}