import React from "react";
import { FormFieldProps } from "@/components/shared/form/FormTypes";

export default function PillTagsInput({
  field,
  formData,
  errors,
  setFormData,
  setErrors,
}: FormFieldProps) {
  const fieldValue = formData[field.name];
  const selectedValues = Array.isArray(fieldValue)
    ? fieldValue.filter(
        (value): value is string | number =>
          typeof value === "string" || typeof value === "number"
      )
    : [];

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {field.options?.map((opt) => {
        const isActive = selectedValues.includes(opt.value);
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => {
              const newValues = isActive
                ? selectedValues.filter((value) => value !== opt.value)
                : [...selectedValues, opt.value];

              setFormData((prev) => ({ ...prev, [field.name]: newValues }));
              if (errors[field.name])
                setErrors((prev) => ({ ...prev, [field.name]: "" }));
            }}
            className={`px-3 md:px-4 py-1.5 md:py-2 border rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-[#C9070A] border-[#C9070A] text-white"
                : "bg-card border-border text-muted-foreground hover:border-[#C9070A] hover:text-[#C9070A]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
