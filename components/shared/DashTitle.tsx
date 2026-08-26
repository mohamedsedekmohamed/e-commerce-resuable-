"use client";

import React, { ReactNode } from "react";
import { Plus } from "lucide-react";
import UIBtn from "@/components/ui/UIBtn";

export interface DashTitleProps {
  title?: string;
  subtitle?: string;
  titleAdd?: string;
  onAddClick?: () => void;
  headerChildren?: ReactNode;
  primaryActionClass?: string;
  children?: ReactNode;
}

export default function DashTitle({
  title,
  subtitle,
  titleAdd,
  onAddClick,
  headerChildren,
  primaryActionClass = "bg-[#C9070A] hover:bg-red-700 text-white",
  children,
}: DashTitleProps) {
  if (!title && !titleAdd && !headerChildren && !children) return null;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full mb-6">
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-col items-start gap-1">
          {title && (
            <h1 className="text-[30px] font-bold text-foreground leading-[36px]">
              {title}
            </h1>
          )}
          {subtitle && <p className="text-[16px] font-normal text-muted-foreground leading-[24px]">{subtitle}</p>}
        </div>
        {headerChildren && <div>{headerChildren}</div>}
      </div>
      <div className="flex flex-row items-center gap-3 w-full md:w-auto">
        {children}
        {titleAdd && (
          <UIBtn
            variant="secondary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            text={titleAdd}
            onClick={onAddClick}
            fullWidth={false} // Adjust on mobile if needed via btnStyle, but md:w-auto implies flex handles it
            btnStyle={`w-full md:w-auto ${primaryActionClass}`}
          />
        )}
      </div>
    </div>
  );
}
