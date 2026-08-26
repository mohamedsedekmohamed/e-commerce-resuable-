import { StylesConfig } from "react-select";
import { SelectOption } from "@/components/shared/form/FormTypes";

export const selectStyles: StylesConfig<SelectOption, boolean> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "hsl(var(--background))",
    borderColor: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--border))",
    borderWidth: "1px",
    borderRadius: "0.75rem",
    minHeight: "44px",
    padding: "0rem 0.5rem",
    fontSize: "0.875rem",
    boxShadow: state.isFocused ? "0 0 0 3px hsl(var(--primary) / 0.1)" : "none",
    transition: "all 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      borderColor: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)"
    }
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0.25rem 0.5rem",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
    padding: "0.5rem",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "hsl(var(--primary))",
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    padding: "0.5rem",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "hsl(var(--destructive))",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.75rem",
    overflow: "visible",
    zIndex: 99999,
    marginTop: "0.5rem",
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 99999,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "0.5rem",
    maxHeight: "240px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "hsl(var(--primary))"
      : state.isFocused
      ? "hsl(var(--muted))"
      : "transparent",
    color: state.isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
    cursor: "pointer",
    borderRadius: "0.5rem",
    padding: "0.625rem 0.75rem",
    marginBottom: "0.25rem",
    fontSize: "0.875rem",
    transition: "all 0.15s ease",
    "&:last-child": {
      marginBottom: 0,
    },
    "&:active": {
      backgroundColor: state.isSelected ? "hsl(var(--primary))" : "hsl(var(--muted))",
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "hsl(var(--foreground))",
    fontSize: "0.875rem",
  }),
  input: (provided) => ({
    ...provided,
    color: "hsl(var(--foreground))",
    fontSize: "0.875rem",
    margin: 0,
    padding: 0,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    fontSize: "0.875rem",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "hsl(var(--muted))",
    borderRadius: "0.5rem",
    padding: "0.125rem 0.25rem",
    margin: "0.125rem",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "hsl(var(--foreground))",
    fontSize: "0.875rem",
    padding: "0.25rem 0.5rem",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    borderRadius: "0 0.375rem 0.375rem 0",
    padding: "0.25rem",
    transition: "all 0.15s ease",
    ":hover": {
      backgroundColor: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
    },
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    fontSize: "0.875rem",
    padding: "0.75rem",
  }),
  loadingMessage: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
    fontSize: "0.875rem",
    padding: "0.75rem",
  }),
};
