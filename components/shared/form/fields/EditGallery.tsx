import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { productsAdmin } from "@/services/products";
import { toast } from "react-hot-toast";

type GalleryImageId = string | number;

interface GalleryImage {
  id: GalleryImageId;
  image?: string | null;
  image_url?: string | null;
}

interface EditGalleryProps {
  productId: GalleryImageId;
  initialGallery?: unknown;
  tForm?: (key: string) => string;
}

const isGalleryImage = (value: unknown): value is GalleryImage => {
  if (!value || typeof value !== "object") return false;

  const image = value as Partial<GalleryImage>;
  return (
    (typeof image.id === "string" || typeof image.id === "number") &&
    (image.image === undefined || image.image === null || typeof image.image === "string") &&
    (image.image_url === undefined || image.image_url === null || typeof image.image_url === "string")
  );
};

const isGalleryImageList = (value: unknown): value is GalleryImage[] =>
  Array.isArray(value) && value.every(isGalleryImage);

const getGalleryImageUrl = (image: GalleryImage) => {
  const source = image.image_url ?? image.image;
  return source?.startsWith("http")
    ? source
    : `https://ecommerce.mazoom.online/storage/${source?.replace(/\\/g, "/") ?? ""}`;
};

export default function EditGallery({ productId, initialGallery, tForm }: EditGalleryProps) {
  const [gallery, setGallery] = useState<GalleryImage[]>(() =>
    isGalleryImageList(initialGallery) ? initialGallery : []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<GalleryImageId | null>(null);

  useEffect(() => {
    if (isGalleryImageList(initialGallery)) {
      setGallery(initialGallery);
    }
  }, [initialGallery]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const formData = new FormData();
    const filesArray = Array.from(e.target.files);
    
    filesArray.forEach((file) => {
      formData.append("images[]", file);
    });

    try {
      const res = await productsAdmin.addGallery(productId, formData);
      if (res.data?.success || res.status === 200 || res.status === 201) {
        const newImages: unknown = res.data?.data ?? res.data;
        if (isGalleryImageList(newImages)) {
          setGallery((prev) => [...prev, ...newImages]);
        } else {
          window.location.reload();
        }
        toast.success(tForm ? tForm('successAdd') : "Added successfully");
      }
    } catch {
      toast.error(tForm ? tForm('common.unexpectedError') : "Error uploading");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeFile = async (imageId: GalleryImageId) => {
    if (!confirm("Are you sure?")) return;
    
    setDeletingId(imageId);
    try {
      await productsAdmin.deleteGalleryImage(imageId);
      setGallery((prev) => prev.filter(img => img.id !== imageId));
      toast.success(tForm ? tForm('successDelete') : "Deleted successfully");
    } catch {
      toast.error(tForm ? tForm('common.unexpectedError') : "Error deleting");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {gallery.map((img) => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden border shadow-sm h-24 md:h-32 bg-muted/20">
            <Image
              src={getGalleryImageUrl(img)}
              alt="Gallery image"
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeFile(img.id)}
              disabled={deletingId === img.id}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md"
            >
              {deletingId === img.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
            </button>
          </div>
        ))}
        
        <label className={`relative border-2 border-dashed rounded-xl h-24 md:h-32 flex flex-col items-center justify-center cursor-pointer border-muted hover:border-primary/50 bg-card hover:bg-primary/5 transition-all group shadow-sm ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <input
            accept="image/png, image/jpeg, image/jpg, image/webp"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <Loader2 size={24} className="text-primary animate-spin mb-2" />
          ) : (
            <Upload size={24} className="text-muted-foreground group-hover:text-primary transition-colors mb-2" />
          )}
          <span className="text-xs md:text-sm text-muted-foreground font-medium group-hover:text-primary transition-colors text-center px-2">
            {isUploading ? "Uploading..." : (tForm ? tForm('uploadText') : "Add Images")}
          </span>
        </label>
      </div>
    </div>
  );
}
