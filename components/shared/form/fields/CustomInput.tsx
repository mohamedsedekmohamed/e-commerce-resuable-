import React from "react";
import { AlertCircle } from "lucide-react";
import { FormFieldProps } from "@/components/shared/form/FormTypes";

export default function CustomInput({
  field,
  formData,
  errors,
  setFormData,
  setErrors,
}: FormFieldProps) {
  if (field.type !== "custom" || !field.render) return null;

  return (
    <div className="w-full">
      {field.render({
        value: formData[field.name],
        onChange: (newValue: unknown) => {
          setFormData((prev) => ({
            ...prev,
            [field.name]: newValue,
          }));
          if (errors[field.name])
            setErrors((prev) => ({ ...prev, [field.name]: "" }));
        },
        error: errors[field.name],
        formData: formData,
        field: field,
        setFormData: setFormData,
      })}
      {errors[field.name] && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
          <AlertCircle size={14} /> {errors[field.name]}
        </p>
      )}
    </div>
  );
}
