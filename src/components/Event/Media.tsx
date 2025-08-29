import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, X } from "lucide-react"

interface MyFormData {
  mainImage: File | null
  bannerImage: File | null
  galleryImages: { file: File; preview: string }[]
}

interface ImagesMediaProps {
  formData: MyFormData
  handleFileUpload: (field: "mainImage" | "bannerImage", file: File | null) => void
  addGalleryImage: (file: File) => void
  removeGalleryImage: (index: number) => void
}

export default function ImagesMedia({
  formData,
  handleFileUpload,
  addGalleryImage,
  removeGalleryImage,
}: ImagesMediaProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 h-full overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Main Card Image</Label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors h-40 flex items-center justify-center">
            {!formData.mainImage?.preview ? (
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
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Banner Image</Label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors h-40 flex items-center justify-center">
            {!formData.bannerImage?.preview ? (
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
  )
}