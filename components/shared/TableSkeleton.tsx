"use client";

import React from "react";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  showIndex?: boolean;
  showActions?: boolean;
  enableMultiSelect?: boolean;
}

export default function TableSkeleton({
  columns,
  rows = 5,
  showIndex = true,
  showActions = true,
  enableMultiSelect = false,
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b-[0.8px] border-secondary-border last:border-0"
        >
          {enableMultiSelect && (
            <td className="px-6 py-6 w-12 text-center align-middle">
              <div className="w-4 h-4 rounded bg-muted animate-pulse mx-auto" />
            </td>
          )}
          {showIndex && (
            <td className="px-6 py-6 w-16 align-middle">
              <div className="w-6 h-4 bg-muted rounded animate-pulse" />
            </td>
          )}
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-6 align-middle">
              <div className="h-4 bg-muted rounded animate-pulse w-full max-w-[80%]" />
            </td>
          ))}
          {showActions && (
            <td className="px-6 py-6 align-middle w-24">
              <div className="flex justify-center items-center gap-2">
                <div className="w-8 h-8 rounded-[10px] bg-muted animate-pulse" />
                <div className="w-8 h-8 rounded-[10px] bg-muted animate-pulse" />
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
}
