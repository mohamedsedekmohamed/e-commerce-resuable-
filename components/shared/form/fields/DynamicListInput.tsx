import React from "react";
import { X } from "lucide-react";
import { FaPlusSquare } from "react-icons/fa";
import { FormFieldProps } from "@/components/shared/form/FormTypes";

export default function DynamicListInput({
  field,
  formData,
  setFormData,
}: FormFieldProps) {
  const fieldValue = formData[field.name];
  const values = Array.isArray(fieldValue)
    ? fieldValue.filter((value): value is string => typeof value === "string")
    : [];

  return (
    <div className="flex flex-col gap-3">
      {values.map((val, index) => {
        const orderLabel = String.fromCharCode(65 + index);
        return (
          <div key={index} className="flex gap-2 items-center">
            <span className="font-bold text-muted-foreground w-5 md:w-6 text-xs md:text-sm">
              {orderLabel}-
            </span>
            <input
              type="text"
              value={val}
              placeholder={`Enter Option ${orderLabel}`}
              className="flex-1 p-2.5 md:p-3 text-sm md:text-base rounded-xl border bg-card focus:border-primary focus:ring-[3px] focus:ring-primary/20 hover:border-primary/50 outline-none shadow-sm placeholder:text-muted-foreground/40 placeholder:text-[13px] placeholder:font-normal transition-all"
              onChange={(e) => {
                const newValues = [...values];
                newValues[index] = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  [field.name]: newValues,
                }));
              }}
            />
            {values.length > 2 && (
              <button
                type="button"
                onClick={() => {
                  const newValues = values.filter((_, itemIndex) => itemIndex !== index);
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: newValues,
                  }));
                }}
                className="p-2 md:p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X size={18} className="md:w-5 md:h-5" />
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          setFormData((prev) => ({
            ...prev,
            [field.name]: [...values, ""],
          }));
        }}
        className="flex items-center justify-center gap-2 p-2.5 md:p-3 mt-2 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-one hover:text-one hover:bg-one/5 transition-all font-medium text-sm md:text-base"
      >
        <FaPlusSquare size={16} className="md:w-[18px] md:h-[18px]" />
        <span>Add Option</span>
      </button>
    </div>
  );
}
