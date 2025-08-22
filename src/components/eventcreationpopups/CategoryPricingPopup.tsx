// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { X } from "lucide-react"

// interface TicketCategory {
//   id: string
//   name: string
//   price: number
//   quantity: number
// }

// interface TimeSlot {
//   startTime: string
//   endTime: string
//   capacity: number
//   duration: string
//   ticketCategories: TicketCategory[]
// }

// interface CategoryPricingPopupProps {
//   applyAllSlot: TimeSlot | null
//   setApplyAllSlot: (slot: TimeSlot | null) => void
//   applyToAllDates: () => void
//   updateApplyAllSlot: (field: string, value: string | number) => void
//   addCategoryToApplyAll: () => void
//   updateApplyAllCategory: (categoryId: string, field: keyof TicketCategory, value: string | number) => void
//   removeCategoryFromApplyAll: (categoryId: string) => void
//   setShowApplyAll: (show: boolean) => void
// }

// export function CategoryPricingPopup({
//   applyAllSlot,
//   setApplyAllSlot,
//   applyToAllDates,
//   updateApplyAllSlot,
//   addCategoryToApplyAll,
//   updateApplyAllCategory,
//   removeCategoryFromApplyAll,
//   setShowApplyAll,
// }: CategoryPricingPopupProps) {
//   if (!applyAllSlot) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold">Apply Categories to All Slots</h3>
//           <Button
//             type="button"
//             onClick={() => setShowApplyAll(false)}
//             variant="ghost"
//             size="sm"
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X />
//           </Button>
//         </div>

//         <div className="space-y-4">
//           <div className="grid grid-cols-3 gap-4">
//             <div className="space-y-1">
//               <Label className="text-sm font-medium">Start Time</Label>
//               <Input
//                 type="time"
//                 value={applyAllSlot.startTime}
//                 onChange={(e) => updateApplyAllSlot("startTime", e.target.value)}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-sm font-medium">End Time</Label>
//               <Input
//                 type="time"
//                 value={applyAllSlot.endTime}
//                 onChange={(e) => updateApplyAllSlot("endTime", e.target.value)}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-sm font-medium">Capacity</Label>
//               <Input
//                 type="number"
//                 value={applyAllSlot.capacity}
//                 onChange={(e) => updateApplyAllSlot("capacity", Number(e.target.value) || 0)}
//                 min="0"
//               />
//             </div>
//           </div>

//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <h4 className="text-sm font-medium text-gray-800">Ticket Categories</h4>
//               <Button
//                 type="button"
//                 onClick={addCategoryToApplyAll}
//                 variant="outline"
//                 size="sm"
//                 className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
//               >
//                 + Add Category
//               </Button>
//             </div>

//             {applyAllSlot.ticketCategories.length === 0 ? (
//               <div className="text-center py-3 text-gray-500 text-sm">
//                 No ticket categories added. Click "Add Category" to get started.
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {applyAllSlot.ticketCategories.map((category) => (
//                   <div
//                     key={category.id}
//                     className="grid grid-cols-4 gap-3 items-center p-3 bg-gray-50 rounded border"
//                   >
//                     <div className="space-y-1">
//                       <Label className="text-xs font-medium text-gray-700">Category Name</Label>
//                       <Input
//                         type="text"
//                         value={category.name}
//                         onChange={(e) => updateApplyAllCategory(category.id, "name", e.target.value)}
//                         className="h-8"
//                         placeholder="e.g., VIP, General"
//                       />
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-xs font-medium text-gray-700">Price ($)</Label>
//                       <Input
//                         type="number"
//                         value={category.price}
//                         onChange={(e) => updateApplyAllCategory(category.id, "price", Number(e.target.value) || 0)}
//                         className="h-8"
//                         min="0"
//                       />
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-xs font-medium text-gray-700">Quantity</Label>
//                       <Input
//                         type="number"
//                         value={category.quantity}
//                         onChange={(e) => updateApplyAllCategory(category.id, "quantity", Number(e.target.value) || 0)}
//                         className="h-8"
//                         min="0"
//                       />
//                     </div>
//                     <div className="flex items-end justify-between">
//                       <div className="text-xs text-gray-600">
//                         Revenue: ${(category.price * category.quantity).toLocaleString()}
//                       </div>
//                       <Button
//                         type="button"
//                         onClick={() => removeCategoryFromApplyAll(category.id)}
//                         variant="ghost"
//                         size="sm"
//                         className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
//                       >
//                         ×
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex justify-end space-x-3 pt-4 border-t">
//             <Button type="button" onClick={() => setShowApplyAll(false)} variant="outline">
//               Cancel
//             </Button>
//             <Button type="button" onClick={applyToAllDates} className="bg-green-600 hover:bg-green-700">
//               Apply to All Selected Dates
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface TicketCategory {
  id: string
  name: string
  price: number
  quantity: number
}

interface CategoryPricingPopupProps {
  categories: TicketCategory[]
  setCategories: (categories: TicketCategory[]) => void
  applyToAllSlots: () => void
  setShowApplyAll: (show: boolean) => void
}

export function CategoryPricingPopup({
  categories,
  setCategories,
  applyToAllSlots,
  setShowApplyAll,
}: CategoryPricingPopupProps) {
  const addCategory = () => {
    const newCategory: TicketCategory = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      quantity: 0,
    }
    setCategories([...categories, newCategory])
  }

  const updateCategory = (categoryId: string, field: keyof TicketCategory, value: string | number) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    ))
  }

  const removeCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Categories to All Slots</h3>
          <Button
            type="button"
            onClick={() => setShowApplyAll(false)}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-800">Ticket Categories</h4>
              <Button
                type="button"
                onClick={addCategory}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
              >
                + Add Category
              </Button>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                No ticket categories added. Click "Add Category" to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="grid grid-cols-4 gap-3 items-center p-3 bg-gray-50 rounded border"
                  >
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-700">Category Name</Label>
                      <Input
                        type="text"
                        value={category.name}
                        onChange={(e) => updateCategory(category.id, "name", e.target.value)}
                        className="h-8"
                        placeholder="e.g., VIP, General"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-700">Price ($)</Label>
                      <Input
                        type="number"
                        value={category.price}
                        onChange={(e) => updateCategory(category.id, "price", Number(e.target.value) || 0)}
                        className="h-8"
                        min="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-700">Quantity</Label>
                      <Input
                        type="number"
                        value={category.quantity}
                        onChange={(e) => updateCategory(category.id, "quantity", Number(e.target.value) || 0)}
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
                        onClick={() => removeCategory(category.id)}
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

            {categories.length > 0 && (
              <div className="text-sm font-medium text-gray-700 bg-blue-50 p-3 rounded">
                Total Revenue per Slot: $
                {categories
                  .reduce((sum, cat) => sum + cat.price * cat.quantity, 0)
                  .toLocaleString()}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" onClick={() => setShowApplyAll(false)} variant="outline">
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={applyToAllSlots} 
              className="bg-green-600 hover:bg-green-700"
              disabled={categories.length === 0}
            >
              Apply Categories to All Slots
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}