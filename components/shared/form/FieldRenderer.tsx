import React from "react";
import { FormFieldProps } from "@/components/shared/form/FormTypes";
import TextInput from "./fields/TextInput";
import NumberInput from "./fields/NumberInput";
import TextareaInput from "./fields/TextareaInput";
import SelectInput from "./fields/SelectInput";
import DateInput from "./fields/DateInput";
import MediaInput from "./fields/MediaInput";
import PillTagsInput from "./fields/PillTagsInput";
import DynamicListInput from "./fields/DynamicListInput";
import SwitchInput from "./fields/SwitchInput";
import CustomInput from "./fields/CustomInput";

export default function FieldRenderer(props: FormFieldProps) {
  const { field } = props;

  if (["text", "email", "password"].includes(field.type)) {
    return <TextInput {...props} />;
  }
  if (["number", "numberdecimal"].includes(field.type)) {
    return <NumberInput {...props} />;
  }
  if (field.type === "textarea") {
    return <TextareaInput {...props} />;
  }
  if (["select", "multipleSelect"].includes(field.type)) {
    return <SelectInput {...props} />;
  }
  if (["datetime", "time", "datemin", "date"].includes(field.type)) {
    return <DateInput {...props} />;
  }
  if (["file", "pdf"].includes(field.type)) {
    return <MediaInput {...props} />;
  }
  if (field.type === "pillTags") {
    return <PillTagsInput {...props} />;
  }
  if (field.type === "dynamic-list") {
    return <DynamicListInput {...props} />;
  }
  if (field.type === "switch") {
    return <SwitchInput {...props} />;
  }
  if (field.type === "custom") {
    return <CustomInput {...props} />;
  }

  // Fallback for unimplemented types
  return null;
}
