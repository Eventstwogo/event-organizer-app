// src/components/Event/Media.tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ImagesMediaProps {
  formData: MyFormData
  handleFileUpload: (field: "mainImage" | "bannerImage", file: File | null) => void
  addGalleryImage: (file: File) => void
  removeGalleryImage: (index: number) => void
}

export default function ImagesMedia({ formData, handleFileUpload, addGalleryImage, removeGalleryImage }: ImagesMediaProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "mainImage" | "bannerImage") => {
    const file = e.target.files?.[0] || null
    handleFileUpload(field, file)
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => addGalleryImage(file))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Main Image</h3>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "mainImage")}
          className="mt-2"
        />
        {formData.mainImage && (
          <div className="mt-2">
            <img
              src={formData.mainImage.url || formData.mainImage.preview}
              alt="Main Image"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold">Banner Image</h3>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "bannerImage")}
          className="mt-2"
        />
        {formData.bannerImage && (
          <div className="mt-2">
            <img
              src={formData.bannerImage.url || formData.bannerImage.preview}
              alt="Banner Image"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold">Gallery Images</h3>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryChange}
          className="mt-2"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.galleryImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url || image.preview}
                alt={`Gallery Image ${index + 1}`}
                className="w-24 h-24 object-cover rounded"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0 w-6 h-6"
                onClick={() => removeGalleryImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}