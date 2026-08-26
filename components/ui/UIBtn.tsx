import React from "react";
import { UIBtnProps } from "@/types/UIBtn.interface";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const variantStyles: Record<string, string> = {
  primary: "bg-primary text-white hover:bg-primary-400 border border-transparent transition-colors duration-150",
  secondary: "bg-secondary text-foreground font-bold hover:bg-secondary-400 border border-transparent transition-colors duration-150",
  accent: "bg-secondary text-foreground font-bold hover:bg-secondary-400 border border-transparent transition-colors duration-150",
  outline: "bg-transparent text-foreground border border-border hover:border-primary hover:text-primary transition-colors duration-150",
  ghost: "bg-transparent text-foreground hover:bg-primary-100 border border-transparent transition-colors duration-150",
  destructive: "bg-red-600 text-white hover:bg-red-700 border border-transparent transition-colors duration-150",
  link: "bg-transparent text-primary hover:underline border-transparent shadow-none p-0 h-auto",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs h-8 gap-1.5",
  md: "px-4 py-2 text-sm h-10 gap-2",
  lg: "px-6 py-3 text-base h-12 gap-3",
};

export default function UIBtn({
  text,
  icon,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  btnStyle = "",
  to,
  external,
  type = "button",
  ariaLabel,
  disabled,
  children,
  className,
  onClick,
  ...buttonProps
}: UIBtnProps & { children?: React.ReactNode, className?: string }) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";
  
  const appliedVariant = variantStyles[variant] || variantStyles.primary;
  const appliedSize = variant === "link" ? "" : sizeStyles[size] || sizeStyles.md;
  const widthStyle = fullWidth ? "w-full" : "";
  const disabledStyle = (disabled || isLoading) ? "opacity-50 cursor-not-allowed active:scale-100" : "cursor-pointer";

  const finalClassName = `${baseStyles} ${appliedVariant} ${appliedSize} ${widthStyle} ${disabledStyle} ${btnStyle} ${className || ""}`.trim();

  const content = (
    <>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!isLoading && icon && <span className="shrink-0">{icon}</span>}
      {(text || children) && <span>{text || children}</span>}
    </>
  );

  if (to) {
    if (external) {
      return (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={finalClassName}
          aria-disabled={disabled || isLoading}
          onClick={(event) => {
            if (disabled || isLoading) event.preventDefault();
            else onClick?.(event);
          }}
        >
          {content}
        </a>
      );
    } else {
      return (
        <Link 
          href={to} 
          className={finalClassName}
          aria-disabled={disabled || isLoading}
          onClick={(event) => {
            if (disabled || isLoading) event.preventDefault();
            else onClick?.(event);
          }}
        >
          {content}
        </Link>
      );
    }
  }

  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      className={finalClassName}
      type={type}
      onClick={onClick}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
