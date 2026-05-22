import React, { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  roundness?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  visualHover?: boolean;
  className?: string;
}

export function Card({
  children,
  roundness = "4xl",
  visualHover = false,
  className,
  ...props
}: CardProps) {
  const roundnessClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    "4xl": "rounded-4xl",
  };

  return (
    <div
      className={cn(
        "bg-custom-coconut/40 dark:bg-custom-blue/40 border border-custom-blue/5 dark:border-custom-coconut/5",
        "backdrop-blur-xl shadow-xl transition-all duration-500 group relative flex flex-col",
        roundnessClasses[roundness],
        visualHover && "hover:shadow-2xl hover:scale-105 hover:shadow-custom-blue/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  hasBorder?: boolean;
  className?: string;
}

export function CardHeader({
  children,
  title,
  subtitle,
  hasBorder = false,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "p-6 sm:p-8 flex items-start justify-between relative gap-4",
        hasBorder && "border-b border-custom-blue/5 dark:border-custom-coconut/5",
        className
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        <div className="text-left space-y-1 min-w-0">
          {title && (
            <h3 className="text-4xl font-kugile text-custom-blue dark:text-custom-celadon truncate leading-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[10px] uppercase tracking-widest font-bold text-custom-blue/40 dark:text-custom-celadon/40 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className, ...props }: CardBodyProps) {
  return (
    <div className={cn("p-6 flex-1 text-left", className)} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hasBorder?: boolean;
  className?: string;
}

export function CardFooter({
  children,
  hasBorder = false,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn(
        "p-6 sm:p-8 mt-auto flex items-center justify-between text-left",
        hasBorder && "border-t border-custom-blue/10 dark:border-custom-coconut/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
