import React from "react";
import { FormFieldProps } from "@/components/shared/form/FormTypes";

const toInputValue = (value: unknown): string | number =>
  typeof value === "string" || typeof value === "number" ? value : "";

export default function NumberInput({
  field,
  formData,
  errors,
  handleChange,
}: FormFieldProps) {
  if (!handleChange) return null;

  return (
    <input
      type="number"
      step={field.type === "numberdecimal" ? "any" : undefined}
      name={field.name}
      value={toInputValue(formData[field.name])}
      placeholder={field.placeholder || `Enter ${field.label}...`}
      className={`appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none no-spinner p-2.5 md:p-3 text-sm md:text-base rounded-xl border bg-card focus:ring-[3px] focus:ring-primary/20 hover:border-primary/50 outline-none shadow-sm placeholder:text-muted-foreground/40 placeholder:text-[13px] placeholder:font-normal transition-all ${
        errors[field.name] ? "border-red-400" : "border-muted focus:border-primary"
      }`}
      onKeyDown={(e) => {
        if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
      }}
      onWheel={(e) => e.currentTarget.blur()}
      onChange={handleChange}
    />
  );
}
