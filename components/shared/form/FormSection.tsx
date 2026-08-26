import React from "react";
import {
  Field,
  FormDataSetter,
  FormValues,
  TranslationFunction,
} from "@/components/shared/form/FormTypes";
import FieldRenderer from "./FieldRenderer";
import { Info, AlertCircle } from "lucide-react";
import { selectStyles } from "./SelectStyles";

interface FormSectionProps {
  sectionTitle: string;
  sectionFields: Field[];
  formData: FormValues;
  setFormData: FormDataSetter;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  previews: Record<string, string>;
  setPreviews: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  tForm: TranslationFunction;
  tTable: TranslationFunction;
}

export default function FormSection({
  sectionTitle,
  sectionFields,
  formData,
  setFormData,
  errors,
  setErrors,
  handleChange,
  previews,
  setPreviews,
  handleFileChange,
  tForm,
  tTable,
}: FormSectionProps) {
  return (
    <div
      key={sectionTitle}
      // إزالة overflow-hidden من هنا لمنع قص القائمة
      className="bg-card rounded-xl md:rounded-2xl shadow-md border border-muted"
    >
      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-5 bg-card border-b border-muted rounded-t-xl md:rounded-t-2xl">
        <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
          {sectionTitle}
        </h2>
      </div>
      <div className="p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-4 md:gap-y-6 text-start">
        {sectionFields.map((field, index) => {
          if (typeof field.hidden === "function" && field.hidden(formData))
            return null;

          return (
            <div
              key={field.name}
              className={`relative flex flex-col gap-1.5 ${
                field.fullWidth ? "col-span-1 md:col-span-2 lg:col-span-3" : ""
              }`}
              // الحل السحري: إعطاء العناصر الأولى z-index أعلى من العناصر التي تليها
              style={{ zIndex: 100 - index }}
            >
              <label className="text-xs md:text-sm font-bold text-foreground flex items-center gap-1 justify-start">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
                {field.tooltip && (
                  <span title={field.tooltip} className="cursor-help">
                    <Info size={14} className="text-muted-foreground" />
                  </span>
                )}
              </label>

              <FieldRenderer
                field={field}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                handleChange={handleChange}
                previews={previews}
                setPreviews={setPreviews}
                handleFileChange={handleFileChange}
                tForm={tForm}
                tTable={tTable}
                selectStyles={selectStyles}
              />

              {field.helperText && !errors[field.name] && (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 justify-start">
                  <Info size={12} /> {field.helperText}
                </p>
              )}
              {errors[field.name] && field.type !== "custom" && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 justify-start mt-1.5">
                  <AlertCircle size={14} /> {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
