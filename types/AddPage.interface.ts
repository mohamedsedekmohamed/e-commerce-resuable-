import { Field, FormValues } from "@/components/shared/form/FormTypes";

export interface AddPageProps {
  title: string;
  fields: Field[];
  showCancel?: boolean;
  onSave: (data: FormValues) => Promise<void>;
  onCancel?: () => void;
  initialData?: FormValues;
  isSaving?: boolean;
  isEdit?: boolean;
}

export interface SectionMeta {
  fields: Field[];
  order: number;
  sidebar: boolean;
}
