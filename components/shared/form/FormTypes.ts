import React from "react";
import type { StylesConfig } from "react-select";

export type FormValues = Record<string, unknown>;
export type FormDataSetter = React.Dispatch<React.SetStateAction<FormValues>>;
export type TranslationFunction = (
  key: string,
  values?: Record<string, string | number | Date>
) => string;

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "numberdecimal"
  | "multipleSelect"
  | "datetime"
  | "time"
  | "datemin"
  | "date"
  | "select"
  | "file"
  | "pdf"
  | "textView"
  | "dynamic-list"
  | "switch"
  | "fileWithOCR"
  | "pillTags"
  | "textarea"
  | "media"
  | "phoneCode"
  | "custom";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  defaultValue?: unknown;
  sidebar?: boolean;
  sectionOrder?: number;
  required?: boolean;
  requiredMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
  customValidator?: (value: unknown, formData: FormValues) => string | null;
  hidden?: (formData: FormValues) => boolean;
  section?: string;
  fullWidth?: boolean;
  tooltip?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  options?: SelectOption[];
  onChange?: (
    value: unknown,
    setFormData: FormDataSetter
  ) => void;
  actionButton?: (props: {
    formData: FormValues;
    setFormData: FormDataSetter;
  }) => React.ReactNode;
  render?: (props: {
    value: unknown;
    onChange: (val: unknown) => void;
    error?: string;
    formData: FormValues;
    field: Field;
    setFormData: FormDataSetter;
  }) => React.ReactNode;
  helperText?: string;
}

export interface FormFieldProps {
  field: Field;
  formData: FormValues;
  setFormData: FormDataSetter;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  previews?: Record<string, string>;
  setPreviews?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  tForm?: TranslationFunction;
  tTable?: TranslationFunction;
  selectStyles?: StylesConfig<SelectOption, boolean>;
}
