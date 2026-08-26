import React from "react";
import { FormFieldProps } from "@/components/shared/form/FormTypes";

const toInputValue = (value: unknown): string | number =>
  typeof value === "string" || typeof value === "number" ? value : "";

export default function TextInput({
  field,
  formData,
  errors,
  handleChange,
}: FormFieldProps) {
  if (!handleChange) return null;

  return (
    <input
      type={field.type}
      name={field.name}
      value={toInputValue(formData[field.name])}
      placeholder={field.placeholder || `Enter ${field.label}...`}
      className={`p-2.5 md:p-3 text-sm md:text-base rounded-xl border bg-card focus:ring-[3px] focus:ring-primary/20 hover:border-primary/50 outline-none shadow-sm placeholder:text-muted-foreground/40 placeholder:text-[13px] placeholder:font-normal transition-all ${
        errors[field.name] ? "border-red-400" : "border-muted focus:border-primary"
      }`}
      onChange={handleChange}
    />
  );
}
