"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'rosewood' 
  | 'celadon' 
  | 'almond' 
  | 'outline' 
  | 'outline-light' 
  | 'ghost' 
  | 'ghost-light'
  | 'theme-responsive';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
// Definiamo i livelli di rotondità
type ButtonRoundness = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

interface ButtonProps {
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  roundness?: ButtonRoundness; // Nuova prop
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  isExternalLink?: boolean;
}

export function Button({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  roundness = 'sm', // Default elegante e sobrio
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'left',
  className = '',
  isExternalLink = false,
}: ButtonProps) {

  const baseStyles = "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group outline-none focus-visible:ring-2 focus-visible:ring-custom-rosewood/50";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-custom-blue text-white hover:bg-custom-blue/90 shadow-sm", // Fondo scuro, testo chiaro
    secondary: "bg-custom-green text-white hover:bg-custom-green/90 shadow-sm", // Fondo scuro, testo chiaro
    rosewood: "bg-custom-rosewood text-white hover:bg-custom-rosewood/90 shadow-sm", // Fondo scuro, testo chiaro
    celadon: "bg-custom-celadon text-custom-blue hover:bg-custom-celadon/90 shadow-sm", // Fondo chiaro, testo scuro
    almond: "bg-custom-almond text-custom-blue hover:bg-custom-almond/90 shadow-sm", // Fondo chiaro, testo scuro
    outline: "border border-custom-blue text-custom-blue hover:bg-custom-blue hover:text-white dark:text-custom-almond dark:border-custom-almond dark:hover:bg-custom-almond dark:hover:text-custom-blue",
    "outline-light": "border border-custom-blue/80 text-custom-blue/80 hover:bg-custom-celadon hover:text-custom-blue dark:border-custom-celadon/50 dark:text-custom-celadon/50 dark:hover:bg-custom-blue dark:hover:text-custom-celadon",
    ghost: "text-custom-blue hover:bg-custom-blue/5",
    "ghost-light": "text-white hover:bg-white/10",
    "theme-responsive": "bg-custom-celadon text-custom-blue/80 dark:bg-custom-blue dark:text-custom-celadon hover:bg-custom-celadon/90 hover:text-custom-blue dark:hover:bg-custom-blue/90 shadow-sm",
  };

  const sizes: Record<ButtonSize, string> = {
    xs: "px-3 py-1 text-[10px]",
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg",
  };

  // Mapping della rotondità
  const roundedStyles: Record<ButtonRoundness, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",  
    "2xl": "rounded-2xl",  
    full: "rounded-full",
  };

  const styles = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    roundedStyles[roundness],
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={cn("transition-transform duration-200", children && "mr-2 group-hover:-translate-x-0.5")}>
              {icon}
            </span>
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className={cn("transition-transform duration-200", children && "ml-2 group-hover:translate-x-0.5")}>
              {icon}
            </span>
          )}
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className={styles} 
        onClick={onClick as any}
        {...(isExternalLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={styles}
    >
      {content}
    </button>
  );
}