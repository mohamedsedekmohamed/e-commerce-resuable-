import React from "react";
import { Upload } from "lucide-react";
import { FormFieldProps } from "@/components/shared/form/FormTypes";

export default function MediaInput({
  field,
  previews,
  handleFileChange,
  tForm,
}: FormFieldProps) {
  if (!handleFileChange || !previews) return null;

  if (field.type === "file") {
    const currentPreview =
      previews[field.name] ||
      (typeof field.defaultValue === "string"
        ? field.defaultValue.replace(/\\/g, "")
        : null);

    return (
      <label
        className={`relative block group border-2 border-dashed rounded-xl p-3 md:p-4 transition-all cursor-pointer bg-card ${
          currentPreview
            ? "border-primary bg-primary/5"
            : "border-muted hover:border-primary/50 shadow-sm hover:shadow-md"
        }`}
      >
        <input
          accept="image/png, image/jpeg, image/jpg, image/webp"
          type="file"
          onChange={(e) => handleFileChange(e, field.name)}
          className="hidden"
        />
        <div className="flex items-center gap-3 md:gap-4 text-start relative">
          {currentPreview ? (
            <div className="relative inline-block">
              {/* File previews can be blob URLs, which are not supported by next/image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPreview}
                alt="preview"
                className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover ring-2 ring-white shadow-md"
              />
            </div>
          ) : (
            <div className="w-12 h-12 md:w-16 md:h-16 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <Upload size={20} className="md:w-6 md:h-6" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">
              {tForm ? tForm('uploadText') : "Click to upload or drag and drop"}
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground">
              {tForm ? tForm('uploadHint') : "PNG, JPG up to 5MB"}
            </span>
          </div>
        </div>
      </label>
    );
  }

  if (field.type === "pdf") {
    return (
      <div
        className={`relative group border-2 border-dashed rounded-xl p-3 md:p-4 transition-all bg-card ${
          previews[field.name]
            ? "border-red-500 bg-red-50/50"
            : "border-muted hover:border-red-300 shadow-sm hover:shadow-md"
        }`}
      >
        <input
          accept="application/pdf"
          type="file"
          onChange={(e) => handleFileChange(e, field.name)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="flex items-center gap-3 md:gap-4 text-start">
          {previews[field.name] ? (
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-lg flex flex-col items-center justify-center text-red-600 ring-2 ring-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                className="md:w-6 md:h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-[9px] md:text-[10px] font-bold mt-1">PDF</span>
            </div>
          ) : (
            <div className="w-12 h-12 md:w-16 md:h-16 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-red-500 transition-colors">
              <Upload size={20} className="md:w-6 md:h-6" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">
              {previews[field.name]
                ? "PDF Selected Successfully"
                : "Click to upload or drag and drop"}
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground">
              PDF file up to 5MB
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
