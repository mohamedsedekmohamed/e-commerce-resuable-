import React from "react";
import { FormFieldProps } from "@/components/shared/form/FormTypes";

export default function TextareaInput({
  field,
  formData,
  errors,
  setFormData,
  setErrors,
}: FormFieldProps) {
  return (
    <textarea
      name={field.name}
      value={(formData[field.name] as string) || ""}
      placeholder={field.placeholder || `Enter ${field.label}...`}
      rows={4}
      className={`p-2.5 md:p-3 text-sm md:text-base rounded-xl border bg-card focus:ring-[3px] focus:ring-primary/20 hover:border-primary/50 outline-none shadow-sm placeholder:text-muted-foreground/40 placeholder:text-[13px] placeholder:font-normal transition-all resize-none ${
        errors[field.name] ? "border-red-400" : "border-muted focus:border-primary"
      }`}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({
          ...prev,
          [field.name]: value,
        }));
        if (errors[field.name]) {
          setErrors((prev) => ({ ...prev, [field.name]: "" }));
        }
      }}
    />
  );
}
