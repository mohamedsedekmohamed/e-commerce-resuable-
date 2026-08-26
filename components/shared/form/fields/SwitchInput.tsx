import React from "react";
import { FormFieldProps } from "@/components/shared/form/FormTypes";

export default function SwitchInput({
  field,
  formData,
  setFormData,
  tTable,
}: FormFieldProps) {
  return (
    <div className="flex items-center rounded-lg gap-3 md:gap-4 py-2 justify-start">
      <button
        type="button"
        onClick={() =>
          setFormData((prev) => ({
            ...prev,
            [field.name]: prev[field.name] ? 0 : 1,
          }))
        }
        className={`relative inline-flex h-6 w-11 md:h-7 md:w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9070A] focus-visible:ring-offset-2 ${
          formData[field.name]
            ? "bg-[#C9070A] shadow-lg shadow-[#C9070A]/30"
            : "bg-muted-foreground/30 hover:bg-muted-foreground/40"
        }`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-4 w-4 md:h-5 md:w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ease-in-out ${
            formData[field.name]
              ? "translate-x-5 md:translate-x-7 rtl:-translate-x-5 rtl:md:-translate-x-7"
              : "translate-x-0"
          }`}
        />
      </button>
      <span
        className={`text-sm md:text-base font-semibold transition-colors duration-300 ${
          formData[field.name] ? "text-[#C9070A]" : "text-muted-foreground"
        }`}
      >
        {tTable ? (formData[field.name] ? tTable("active") : tTable("inactive")) : formData[field.name] ? "Active" : "Inactive"}
      </span>
    </div>
  );
}
