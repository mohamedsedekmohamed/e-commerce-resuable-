import { ReactNode } from "react";

type TranslationValues = Record<string, string | number | Date>;

export interface TableColumn<T = Record<string, unknown>> {
  header: string;
  key: Extract<keyof T, string> | string;
  render?: (value: unknown, row: T) => ReactNode;
  filterable?: boolean;
  filterType?: "text" | "select";
}

export interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | number)[];
  placeholder?: string;
  t: (key: string, values?: TranslationValues) => string;
}

export interface TableFilterButton {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

export interface TableRowActions<T> {
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onToggleStatus?: (row: T) => void;
}

export interface ReusableTableProps<T = Record<string, unknown>> {
  title: string;
  columns: TableColumn<T>[];
  data?: T[];
  subtitle?: string;
  onAddClick?: () => void;
  titleAdd?: string;
  onSearch?: (query: string) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  extraActions?: (row: T) => ReactNode;
  showStatusInActions?: boolean;
  onToggleStatus?: (row: T) => void;
  statusKey?: Extract<keyof T, string> | string;
  children?: ReactNode;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  isServerSide?: boolean;
  serverTotalPages?: number;
  serverTotalItems?: number;
  serverCurrentPage?: number;
  onServerPageChange?: (page: number) => void;
  onServerSearchChange?: (value: string) => void;
  headerRightChildren?: ReactNode;
  customFilterButtons?: TableFilterButton[];
  filterVariant?: "default" | "red";
  searchContainerClass?: string;
  enableMultiSelect?: boolean;
  onMultiDelete?: (ids: number[]) => Promise<void>;
  onMultiread?: (ids: number[]) => Promise<void>;
  idKey?: Extract<keyof T, string> | string;
  hasSearch?: boolean;
  showIndex?: boolean;
  isLoading?: boolean;
  renderCard?: (row: T, actions: TableRowActions<T>) => ReactNode;
  defaultViewMode?: "table" | "grid";
}
