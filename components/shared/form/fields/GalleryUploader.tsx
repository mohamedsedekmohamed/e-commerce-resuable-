import React, { useEffect, useMemo } from "react";
import { Upload, X } from "lucide-react";
import { Field } from "@/components/shared/form/FormTypes";

interface ExistingGalleryImage {
  id: string | number;
  image?: string | null;
  image_url?: string | null;
}

type GalleryValue = File | string | ExistingGalleryImage;

interface GalleryUploaderProps {
  value?: unknown;
  onChange: (value: GalleryValue[]) => void;
  error?: string;
  field: Field;
  tForm?: (key: string) => string;
}

const isGalleryValue = (value: unknown): value is GalleryValue =>
  value instanceof File
  || typeof value === "string"
  || (typeof value === "object" && value !== null && "id" in value
    && (typeof value.id === "string" || typeof value.id === "number"));

const toPreviewUrl = (value: GalleryValue) => {
  if (value instanceof File) return URL.createObjectURL(value);

  const source = typeof value === "string" ? value : value.image_url ?? value.image ?? "";
  return source.startsWith("http")
    ? source
    : `https://ecommerce.mazoom.online/storage/${source.replace(/\\/g, "/")}`;
};

export default function GalleryUploader({
  value,
  onChange,
  error,
  field,
  tForm,
}: GalleryUploaderProps) {
  const galleryValues = useMemo(
    () => (Array.isArray(value) ? value.filter(isGalleryValue) : []),
    [value]
  );
  const previews = useMemo(() => galleryValues.map(toPreviewUrl), [galleryValues]);

  useEffect(
    () => () => {
      previews.forEach((preview) => {
        if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      });
    },
    [previews]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onChange([...galleryValues, ...Array.from(event.target.files)]);
    }
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    onChange(galleryValues.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {previews.map((preview, index) => (
          <div key={`${preview}-${index}`} className="relative group rounded-xl overflow-hidden border shadow-sm h-24 md:h-32">
            {/* Blob URLs from local uploads require a native image element. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Gallery preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <label className="relative border-2 border-dashed rounded-xl h-24 md:h-32 flex flex-col items-center justify-center cursor-pointer border-muted hover:border-primary/50 bg-card hover:bg-primary/5 transition-all group shadow-sm">
          <input
            accept="image/png, image/jpeg, image/jpg, image/webp"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            aria-label={field.label}
          />
          <Upload size={24} className="text-muted-foreground group-hover:text-primary transition-colors mb-2" />
          <span className="text-xs md:text-sm text-muted-foreground font-medium group-hover:text-primary transition-colors">
            {tForm ? tForm("uploadText") : "Add Images"}
          </span>
        </label>
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
