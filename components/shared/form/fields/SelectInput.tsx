"use client";

import React, { useSyncExternalStore } from "react";
import Select, {
  type MultiValue,
  type SingleValue,
  type StylesConfig,
} from "react-select";
import { FormFieldProps, SelectOption } from "@/components/shared/form/FormTypes";

const subscribeToMountStatus = () => () => undefined;
const getClientMountStatus = () => true;
const getServerMountStatus = () => false;

export default function SelectInput({
  field,
  formData,
  errors,
  setFormData,
  setErrors,
  selectStyles,
  tForm,
}: FormFieldProps) {
  const isMounted = useSyncExternalStore(
    subscribeToMountStatus,
    getClientMountStatus,
    getServerMountStatus
  );

  let noOptionsMsg = "No options available";
  try {
    if (tForm) noOptionsMsg = tForm("noOptions");
  } catch {
    // Fall back to the built-in English label if a translation is unavailable.
  }

  const customStyles: StylesConfig<SelectOption, boolean> = {
    ...selectStyles,
    menuPortal: (base) => ({
      ...base,
      zIndex: 99999,
    }),
    menu: (base, state) => ({
      ...(selectStyles?.menu ? selectStyles.menu(base, state) : base),
      zIndex: 99999,
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      overflow: "hidden",
    }),
    option: (base, state) => ({
      ...(selectStyles?.option ? selectStyles.option(base, state) : base),
      backgroundColor: state.isSelected
        ? "#C9070A"
        : state.isFocused
          ? "#f3f4f6"
          : "transparent",
      color: state.isSelected ? "#ffffff" : "#1f2937",
      cursor: "pointer",
      padding: "10px 14px",
      "&:active": {
        backgroundColor: "#C9070A",
      },
    }),
    control: (base, state) => ({
      ...(selectStyles?.control ? selectStyles.control(base, state) : base),
      minHeight: "44px",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#C9070A" : base.borderColor,
      boxShadow: state.isFocused ? "0 0 0 1px #C9070A" : base.boxShadow,
      "&:hover": {
        borderColor: state.isFocused ? "#C9070A" : base.borderColor,
      },
    }),
  };

  if (!isMounted) return null;

  let safePlaceholder = "Select...";
  try {
    if (tForm) safePlaceholder = tForm("searchOptions");
  } catch {
    // Keep the built-in placeholder when the translation key is unavailable.
  }

  const fieldValue = formData[field.name];
  const selectedValues = Array.isArray(fieldValue)
    ? fieldValue.filter(
        (value): value is string | number =>
          typeof value === "string" || typeof value === "number"
      )
    : [];

  const commonProps = {
    name: field.name,
    placeholder: field.placeholder || safePlaceholder,
    options: field.options,
    styles: customStyles,
    menuPortalTarget: typeof document !== "undefined" ? document.body : undefined,
    noOptionsMessage: () => noOptionsMsg,
    isSearchable: true,
    menuPosition: "fixed" as const,
    menuPlacement: "auto" as const,
    classNamePrefix: "select",
    className: "w-full text-sm md:text-base",
  };

  if (field.type === "multipleSelect") {
    return (
      <Select<SelectOption, true>
        {...commonProps}
        isMulti
        value={field.options?.filter((option) => selectedValues.includes(option.value)) ?? []}
        onChange={(selected: MultiValue<SelectOption>) => {
          const values = selected.map((option) => option.value);
          setFormData((prev) => ({ ...prev, [field.name]: values }));
          if (errors[field.name]) setErrors((prev) => ({ ...prev, [field.name]: "" }));
        }}
        isClearable
      />
    );
  }

  const currentValue = formData[field.name];
  return (
    <Select<SelectOption, false>
      {...commonProps}
      instanceId={field.name}
      value={
        field.options?.find(
          (option) => String(option.value) === String(currentValue ?? "")
        ) ?? null
      }
      onChange={(selected: SingleValue<SelectOption>) => {
        const selectedValue = selected?.value ?? "";
        setFormData((prev) => ({ ...prev, [field.name]: selectedValue }));
        if (errors[field.name]) setErrors((prev) => ({ ...prev, [field.name]: "" }));
        field.onChange?.(selectedValue, setFormData);
      }}
      isClearable={!field.required}
    />
  );
}
