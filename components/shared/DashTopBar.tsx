"use client";

import React, { ReactNode } from "react";
import { Search } from "lucide-react";
import DashTitle from "./DashTitle";
import UIBtn from "@/components/ui/UIBtn";

export interface FilterButtonProps {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

interface DashboardTopBarProps {
  title?: string;
  subtitle?: string;
  titleAdd?: string;
  onAddClick?: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  hasSearch?: boolean;
  filterButtons?: FilterButtonProps[];
  filterVariant?: "default" | "red";
  customFilterNode?: ReactNode;
  children?: ReactNode;
  headerChildren?: ReactNode;
  headerRightChildren?: ReactNode;
  primaryActionClass?: string;
  searchContainerClass?: string;
}

export default function DashboardTopBar({
  title,
  subtitle,
  titleAdd,
  
  onAddClick,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  hasSearch = true,
  filterButtons = [],
  filterVariant = "default",
  customFilterNode,
  children,
  headerChildren,
  headerRightChildren,
  primaryActionClass = "bg-secondary hover:bg-secondary-600 text-white",
  searchContainerClass = "relative flex-1 min-w-[200px] h-[44px]",
}: DashboardTopBarProps) {
  return (
    <div className="w-full flex flex-col mb-4">
      {/* Header */}
      <DashTitle
        title={title}
        subtitle={subtitle}
        titleAdd={titleAdd}
        onAddClick={onAddClick}
        headerChildren={headerChildren}
        primaryActionClass={primaryActionClass}
      >
        {headerRightChildren}
      </DashTitle>

      {/* Search & Actions Container */}
      {(hasSearch || filterButtons.length > 0 || customFilterNode || children) && (
        <div className="flex flex-col items-start px-[20.8px] pt-[20.8px] pb-[0.8px] bg-[rgba(255,255,255,0.85)] border-[0.8px] border-border rounded-[16px] w-full">
          <div className="flex flex-col md:flex-row items-center gap-[16px] w-full mb-[20px] flex-wrap md:flex-nowrap">
          {/* Search Input */}
          {hasSearch && (
            <div className={searchContainerClass}>
              <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground rtl:left-auto rtl:right-[14px]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full h-full ltr:pl-[44px] ltr:pr-[16px] rtl:pr-[44px] rtl:pl-[16px] border-[0.8px] border-border rounded-[14px] bg-card text-[14px] text-foreground placeholder-[rgba(18,18,18,0.5)] outline-none focus:border-[#717171] transition-colors"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}

          {/* Filter Buttons */}
          {filterButtons.length > 0 && (
            <div className="flex items-center gap-[16px] flex-wrap">
              {filterButtons.map((btn, idx) => {
                const variant = btn.isActive ? (filterVariant === "red" ? "secondary" : "primary") : "outline";
                return (
                  <UIBtn
                    key={idx}
                    variant={variant}
                    size="md"
                    text={btn.label}
                    icon={btn.icon}
                    onClick={btn.onClick}
                    btnStyle="min-w-[120px]"
                  />
                );
              })}
            </div>
          )}

          {/* Custom Filter Node */}
          {customFilterNode && (
            <div className="flex items-center gap-[16px]">
              {customFilterNode}
            </div>
          )}
        </div>

          {children}
        </div>
      )}
    </div>
  );
}
