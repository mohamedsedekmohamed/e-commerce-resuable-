import React from "react";

export interface UIBtnProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  text?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  btnStyle?: string; // Additional custom classes
  to?: string; // If provided, renders as a link
  external?: boolean; // If true, opens link in a new tab
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}
