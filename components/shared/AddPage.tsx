"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import UIBtn from "@/components/ui/UIBtn";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Field, FormValues } from "@/components/shared/form/FormTypes";
import FormSection from "./form/FormSection";
import { AddPageProps, SectionMeta } from "@/types/AddPage.interface";

const AddPage: React.FC<AddPageProps> = ({
  title,
  fields,
  showCancel=true,
  onSave,
  onCancel,
  initialData,
  isSaving = false,
}) => {
  const tForm = useTranslations('admin.form');
  const tTable = useTranslations('admin.table');

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const appliedInitialDataSignature = useRef<string | null>(null);

  const [formData, setFormData] = useState<FormValues>(() =>
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.defaultValue ?? "" }),
      {}
    )
  );

  // بناء الـ sections مع الـ metadata (sidebar + order)
  const sections = fields.reduce(
    (acc: Record<string, SectionMeta>, field) => {
      const sectionName = field.section || tForm('generalInfo');
      if (!acc[sectionName]) {
        acc[sectionName] = {
          fields: [],
          order: field.sectionOrder ?? 0,
          sidebar: field.sidebar ?? false,
        };
      }
      acc[sectionName].fields.push(field);
      return acc;
    },
    {}
  );

  const mainSections = Object.entries(sections)
    .filter(([, sec]) => !sec.sidebar)
    .sort(([, a], [, b]) => a.order - b.order);

  const sidebarSections = Object.entries(sections)
    .filter(([, sec]) => sec.sidebar)
    .sort(([, a], [, b]) => a.order - b.order);

  useEffect(() => {
    const initialDataSignature = JSON.stringify(initialData ?? {});
    if (appliedInitialDataSignature.current === initialDataSignature) return;

    appliedInitialDataSignature.current = initialDataSignature;
    if (!initialData || Object.keys(initialData).length === 0) return;

    setFormData((prev) => ({ ...prev, ...initialData }));

    const newPreviews: Record<string, string> = {};
    Object.entries(initialData).forEach(([key, value]) => {
      if (typeof value === "string" && value.includes("http")) {
        newPreviews[key] = value;
      }
    });
    setPreviews(newPreviews);
  }, [initialData]);

  // --- Validation ---
  const validateField = useCallback(
    (field: Field, value: unknown): string => {
      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);

      if (field.required && isEmpty) {
        return field.requiredMessage || tForm('required');
      }

      if (
        !isEmpty &&
        (field.type === "number" || field.type === "numberdecimal")
      ) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return tForm('invalidNumber');
        } else if (numValue < 0) {
          return tForm('negativeNumber');
        }
      }

      if (!isEmpty && field.pattern && !field.pattern.test(String(value))) {
        return field.patternMessage || "Invalid format";
      }

      if (field.customValidator) {
        const customError = field.customValidator(value, formData);
        if (customError) return customError;
      }

      return "";
    },
    [formData, tForm]
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (typeof field.hidden === "function" && field.hidden(formData)) return;
      const error = validateField(field, formData[field.name]);
      if (error) newErrors[field.name] = error;
    });
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error(tForm('fillRequired'));
      return false;
    }
    
    return true;
  };

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    const finalValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
      return;
    }

    router.back();
  }, [onCancel, router]);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-transparent min-h-screen text-start w-full">
      {/* Header */}
      <div className="mx-auto mb-4 md:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            {title}
          </h1>
        </div>
        {showCancel && (
          <UIBtn
            variant="outline"
            size="md"
            icon={<ArrowLeft className="rtl:-scale-x-100" size={18} />}
            text={tForm('cancel')}
            onClick={handleCancel}
            btnStyle="md:w-fit w-full"
          />
        )}
      </div>

      <form
        onSubmit={async (e) => {
          
          e.preventDefault();
          if (!validateForm()) return;
          try {
            setIsSubmitting(true);
            await onSave(formData);
          } catch (err) {
            console.error(err);
          } finally {
            setIsSubmitting(false);
          }
        }}
        className="mx-auto space-y-4 md:space-y-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
          {/* Main Column - يسار */}
          <div className="flex-1 w-full flex flex-col gap-4 md:gap-6">
            {mainSections.map(([sectionTitle, sec]) => (
              <FormSection
                key={sectionTitle}
                sectionTitle={sectionTitle}
                sectionFields={sec.fields}
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
              />
            ))}
          </div>

          {/* Sidebar Column - يمين */}
          {sidebarSections.length > 0 && (
            <div className="w-full lg:w-80 flex flex-col gap-4 md:gap-6 lg:shrink-0">
              {sidebarSections.map(([sectionTitle, sec]) => (
                <FormSection
                  key={sectionTitle}
                  sectionTitle={sectionTitle}
                  sectionFields={sec.fields}
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
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3 md:gap-4 pb-8 md:pb-12 pt-4">
          
          <UIBtn
            variant="secondary"
            size="lg"
            type="submit"
            text={tForm('save')}
            icon={!(isSubmitting || isSaving) ? <Save size={20} /> : undefined}
            isLoading={isSubmitting || isSaving}
            btnStyle="w-full md:w-auto md:px-12"
          />
        </div>
      </form>
    </div>
  );
};

export default AddPage;
