import React from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import { FormFieldProps } from "@/components/shared/form/FormTypes";
import "react-datepicker/dist/react-datepicker.css";

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) return value;
  if (typeof value !== "string" && typeof value !== "number") return null;

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const toTimeDate = (value: unknown): Date | null =>
  typeof value === "string" ? toDate(`1970-01-01T${value}`) : null;

export default function DateInput({
  field,
  formData,
  setFormData,
  tForm,
}: FormFieldProps) {
  const fieldValue = formData[field.name];

  if (field.type === "datetime") {
    return (
      <div className="relative w-full">
        <DatePicker
          selected={toDate(fieldValue)}
          onChange={(date: Date | null) =>
            setFormData((prev) => ({
              ...prev,
              [field.name]: date
                ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 19)
                : "",
            }))
          }
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={5}
          dateFormat="yyyy-MM-dd HH:mm"
          minDate={new Date()}
          placeholderText={field.placeholder || (tForm ? tForm('selectDateTime') : "Select date & time")}
          wrapperClassName="w-full"
          className="w-full h-[44px] px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary/60 transition-all placeholder:text-muted-foreground"
        />
        <div className="absolute inset-y-0 flex items-center pointer-events-none ltr:right-0 ltr:pr-3 rtl:left-0 rtl:pl-3">
          <Calendar className="w-[18px] h-[18px] text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (field.type === "time") {
    return (
      <div className="relative w-full">
        <DatePicker
          selected={toTimeDate(fieldValue)}
          onChange={(date: Date | null) =>
            setFormData((prev) => ({
              ...prev,
              [field.name]: date
                ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(11, 19)
                : "",
            }))
          }
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={5}
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          placeholderText={field.placeholder || (tForm ? tForm('selectTime') : "Select time")}
          wrapperClassName="w-full"
          className="w-full h-[44px] px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary/60 transition-all placeholder:text-muted-foreground"
        />
        <div className="absolute inset-y-0 flex items-center pointer-events-none ltr:right-0 ltr:pr-3 rtl:left-0 rtl:pl-3">
          <Calendar className="w-[18px] h-[18px] text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (field.type === "datemin") {
    return (
      <div className="relative w-full">
        <DatePicker
          selected={toDate(fieldValue)}
          onChange={(date: Date | null) =>
            setFormData((prev) => ({
              ...prev,
              [field.name]: date ? date.toISOString() : "",
            }))
          }
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          placeholderText={field.placeholder || (tForm ? tForm('selectDate') : "Select date")}
          wrapperClassName="w-full"
          className="w-full h-[44px] px-4 ltr:pr-10 rtl:pl-10 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary/60 transition-all placeholder:text-muted-foreground"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          scrollableYearDropdown
          yearDropdownItemNumber={100}
        />
        <div className="absolute inset-y-0 flex items-center pointer-events-none ltr:right-0 ltr:pr-3 rtl:left-0 rtl:pl-3">
          <Calendar className="w-[18px] h-[18px] text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div className="relative w-full">
        <DatePicker
          selected={
            fieldValue instanceof Date
              ? fieldValue
              : typeof fieldValue === "string"
                ? toDate(fieldValue.replace(/-/g, "/"))
                : null
          }
          onChange={(date: Date | null) => {
            if (!date) {
              setFormData((prev) => ({ ...prev, [field.name]: "" }));
              return;
            }
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;
            setFormData((prev) => ({
              ...prev,
              [field.name]: formattedDate,
            }));
          }}
          dateFormat="yyyy/MM/dd"
          placeholderText={field.placeholder || (tForm ? tForm('selectDate') : "Select date")}
          wrapperClassName="w-full"
          className="w-full h-[44px] px-4 ltr:pr-10 rtl:pl-10 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary/60 transition-all placeholder:text-muted-foreground"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          minDate={field.minDate}
          maxDate={field.maxDate}
        />
        <div className="absolute inset-y-0 flex items-center pointer-events-none ltr:right-0 ltr:pr-3 rtl:left-0 rtl:pl-3">
          <Calendar className="w-[18px] h-[18px] text-muted-foreground" />
        </div>
      </div>
    );
  }

  return null;
}
